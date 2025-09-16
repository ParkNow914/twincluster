from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from typing import List, Optional

from fastapi import HTTPException, status

from app.core.config import settings


def send_email(
    email_to: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
) -> None:
    """
    Send an email using the configured SMTP server.
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email configuration is not set up properly",
        )
    
    # Create message container
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    msg['To'] = email_to
    
    # Attach parts
    if text_content:
        part1 = MIMEText(text_content, 'plain')
        msg.attach(part1)
    
    part2 = MIMEText(html_content, 'html')
    msg.attach(part2)
    
    # Send the email
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}",
        )

def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    """
    Send a password reset email.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password Reset"
    
    # TODO: Replace with your actual password reset URL
    reset_url = f"{settings.SERVER_HOST}/reset-password?token={token}"
    
    html_content = f"""
    <html>
        <body>
            <h2>Password Reset</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password for {project_name}.</p>
            <p>Please click the link below to reset your password:</p>
            <p><a href="{reset_url}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br/>{project_name} Team</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Password Reset
    \n
    Hello,
    \n
    You have requested to reset your password for {project_name}.
    \n
    Please visit the following link to reset your password:
    {reset_url}
    \n
    If you did not request this, please ignore this email.
    \n
    Best regards,
    {project_name} Team
    """.format(project_name=project_name, reset_url=reset_url)
    
    send_email(
        email_to=email_to,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )

def send_new_account_email(email_to: str, username: str, password: str) -> None:
    """
    Send a new account notification email.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New Account Created"
    
    login_url = f"{settings.SERVER_HOST}/login"
    
    html_content = f"""
    <html>
        <body>
            <h2>Welcome to {project_name}!</h2>
            <p>Hello {username},</p>
            <p>Your account has been created successfully.</p>
            <p>Here are your login details:</p>
            <p>Email: {email_to}<br/>
            Password: {password}</p>
            <p>Please log in and change your password as soon as possible.</p>
            <p><a href="{login_url}">Log in to your account</a></p>
            <p>Best regards,<br/>{project_name} Team</p>
        </body>
    </html>
    """.format(project_name=project_name, username=username, email_to=email_to, 
               password=password, login_url=login_url)
    
    text_content = f"""
    Welcome to {project_name}!
    \n
    Hello {username},
    \n
    Your account has been created successfully.
    \n
    Here are your login details:
    Email: {email_to}
    Password: {password}
    \n
    Please log in and change your password as soon as possible.
    \n
    Log in to your account: {login_url}
    \n
    Best regards,
    {project_name} Team
    """.format(project_name=project_name, username=username, email_to=email_to, 
               password=password, login_url=login_url)
    
    send_email(
        email_to=email_to,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )
