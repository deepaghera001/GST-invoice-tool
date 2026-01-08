import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

interface DocumentRequest {
  documentName: string;
  description: string;
  userEmail?: string;
  additionalInfo?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.documentName || !body.description) {
      return NextResponse.json(
        { error: 'Document name and description are required' },
        { status: 400 }
      );
    }

    const requestData: DocumentRequest = {
      documentName: body.documentName,
      description: body.description,
      userEmail: body.userEmail || 'Not provided',
      additionalInfo: body.additionalInfo || 'None',
      timestamp: body.timestamp || new Date().toISOString(),
    };

    // Send email notification (only if RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: 'Document Requests <onboarding@resend.dev>', // Resend's test email
          to: [process.env.ADMIN_EMAIL],
          subject: `📄 New Document Request: ${requestData.documentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e293b; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">
                New Document Request Received
              </h2>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3b82f6; margin-top: 0;">📋 Document Name</h3>
                <p style="font-size: 16px; color: #1e293b; font-weight: 600;">
                  ${requestData.documentName}
                </p>
              </div>

              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3b82f6; margin-top: 0;">📝 Description</h3>
                <p style="color: #475569; line-height: 1.6;">
                  ${requestData.description}
                </p>
              </div>

              ${requestData.additionalInfo !== 'None' ? `
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #3b82f6; margin-top: 0;">ℹ️ Additional Information</h3>
                  <p style="color: #475569; line-height: 1.6;">
                    ${requestData.additionalInfo}
                  </p>
                </div>
              ` : ''}

              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3b82f6; margin-top: 0;">👤 User Contact</h3>
                <p style="color: #475569;">
                  <strong>Email:</strong> ${requestData.userEmail}
                </p>
                <p style="color: #64748b; font-size: 14px;">
                  <strong>Submitted:</strong> ${new Date(requestData.timestamp).toLocaleString()}
                </p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
                <p>This email was sent from your PDF Generation Tool document request form.</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue anyway - don't fail the request if email fails
      }
    }

    // Also log to console for development
    console.log('📄 New Document Request:', {
      documentName: requestData.documentName,
      userEmail: requestData.userEmail,
      timestamp: requestData.timestamp,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Document request submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing document request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
