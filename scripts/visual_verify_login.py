from playwright.sync_api import sync_playwright, expect
import time
import os

def verify_portal_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1024})
        page = context.new_page()

        url = "http://localhost:3000/login"
        print(f"Navigating to {url}...")
        try:
            page.goto(url, wait_until="networkidle", timeout=10000)
            print(f"Connected to {url}")
        except Exception as e:
            print(f"Failed to connect: {e}")
            return

        # Check for Industrial branding on login page
        expect(page.get_by_text("TSysLab Industrial")).to_be_visible()

        # Take screenshot
        os.makedirs("./verification", exist_ok=True)
        path = "./verification/login_redesign.png"
        page.screenshot(path=path, full_page=True)
        print(f"Screenshot captured at {path}")

        browser.close()

if __name__ == "__main__":
    verify_portal_redesign()
