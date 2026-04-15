from playwright.sync_api import sync_playwright, expect
import time
import os

def verify_portal_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1024})
        page = context.new_page()

        # Determine port from log or try range
        ports = [3000, 3001, 3002, 3003, 3004, 3005]
        success = False
        for port in ports:
            url = f"http://localhost:{port}"
            print(f"Trying {url}...")
            try:
                page.goto(url, wait_until="networkidle", timeout=5000)
                success = True
                print(f"Connected to {url}")
                break
            except:
                continue

        if not success:
            print("Failed to connect to any dev server port.")
            return

        # Check for Industrial branding
        expect(page.get_by_text("TSysLab Industrial")).to_be_visible()

        # Verifying navigation items
        expect(page.get_by_text("Analytics")).to_be_visible()

        # Take screenshot
        os.makedirs("./verification", exist_ok=True)
        path = "./verification/portal_redesign_v2.png"
        page.screenshot(path=path, full_page=True)
        print(f"Screenshot captured at {path}")

        browser.close()

if __name__ == "__main__":
    verify_portal_redesign()
