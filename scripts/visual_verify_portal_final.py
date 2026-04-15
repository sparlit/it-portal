from playwright.sync_api import sync_playwright, expect
import os

def verify_portal_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1024})
        page = context.new_page()

        # 1. Login
        print("Logging in...")
        page.goto("http://localhost:3000/login")
        page.fill('input[type="text"]', "admin")
        page.fill('input[type="password"]', "Admin@123")
        page.click('button:has-text("System Access")')

        # 2. Wait for redirect to dashboard
        print("Waiting for dashboard...")
        page.wait_for_url("http://localhost:3000/", timeout=10000)

        # 3. Verify Industrial branding and tabs
        expect(page.get_by_role("heading", name="TSysLab Industrial")).to_be_visible()
        expect(page.get_by_role("tab", name="Analytics")).to_be_visible()

        # 4. Take screenshot of the new portal
        os.makedirs("./verification", exist_ok=True)
        path = "./verification/portal_redesign_final.png"
        page.screenshot(path=path, full_page=True)
        print(f"Screenshot captured at {path}")

        browser.close()

if __name__ == "__main__":
    verify_portal_redesign()
