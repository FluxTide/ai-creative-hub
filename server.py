#!/usr/bin/env python3
import http.server
import socket
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.header import Header

DIRECTORY = "/home/karven/.hermes/workspace/ai-creative-hub/public"

# SMTP 邮件发送配置 (若暂未配置账号，则无缝切换到本地安全演示通道，并写入日志)
SMTP_SERVER = os.environ.get("HUB_SMTP_SERVER", "")
SMTP_PORT = int(os.environ.get("HUB_SMTP_PORT", "465"))
SMTP_USER = os.environ.get("HUB_SMTP_USER", "")
SMTP_PASS = os.environ.get("HUB_SMTP_PASS", "")

def send_real_email(to_email, code):
    """尝试通过 SMTP 发送真实邮件；未配置则退回到安全模拟"""
    if not (SMTP_SERVER and SMTP_USER and SMTP_PASS):
        print(f"[AUTH-DEV] 未配置 SMTP 账户，触发本地安全模拟发信 -> 收件人: {to_email}, 验证码: {code}")
        return False, "simulated"

    try:
        html_content = f"""
        <div style="max-width: 520px; margin: 0 auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF9F6; border-radius: 16px; border: 1px solid #E5DFD7;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #4A4656; margin: 0; font-size: 22px;">水母的探索日记 · 创作者认证</h2>
                <p style="color: #8C8699; font-size: 13px; margin-top: 6px;">AI 创作与提示词资源库入场密令</p>
            </div>
            <div style="background: #FFFFFF; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #EFECE6; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <p style="color: #635F6F; font-size: 14px; margin: 0 0 16px 0;">你好，探险者！你的邮箱注册验证码为：</p>
                <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #7B68EE; padding: 12px 0; background: #F4F1FA; border-radius: 8px; display: inline-block; width: 80%;">
                    {code}
                </div>
                <p style="color: #A09BAA; font-size: 12px; margin-top: 16px; margin-bottom: 0;">此验证码在 5 分钟内有效，请勿将验证码泄露给他人。</p>
            </div>
            <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #A09BAA;">
                © 2026 水母的探索日记 · Crafted with Morandi Spirit
            </div>
        </div>
        """
        msg = MIMEText(html_content, 'html', 'utf-8')
        msg['Subject'] = '【水母的探索日记】你的网站注册验证码'
        msg['From'] = f"水母的探索日记 <{SMTP_USER}>"
        msg['To'] = to_email

        if SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=8)
        else:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=8)
            server.starttls()
        
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, [to_email], msg.as_string())
        server.quit()
        print(f"[AUTH] 真实邮件已成功投递至: {to_email}")
        return True, "sent"
    except Exception as e:
        print(f"[AUTH-ERR] 发信失败: {e}")
        return False, str(e)

class DualStackServer(http.server.ThreadingHTTPServer):
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/send-email-code':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                email = data.get('email', '')
                code = data.get('code', '')

                if not email or not code:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'ok': False, 'error': 'Missing parameters'}).encode('utf-8'))
                    return

                success, mode = send_real_email(email, code)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': True, 'mode': mode, 'code': code}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': False, 'error': str(e)}).encode('utf-8'))
            return

        self.send_error(404, "Not Found")

    def log_message(self, format, *args):
        # 仅打印关键接口日志
        if any(api in args[0] for api in ['/api/']):
            print(f"[HTTP-API] {args[0]}")

if __name__ == "__main__":
    server_address = ("0.0.0.0", 8899)
    try:
        with DualStackServer(server_address, Handler) as httpd:
            print("Threaded HTTP Server listening on port 8899...")
            httpd.serve_forever()
    except Exception as e:
        print(f"[FATAL-SERVER-ERR] {e}")
