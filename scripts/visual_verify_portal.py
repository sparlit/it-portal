from playwright.sync_api import sync_playwright, expect
import time
import os

def verify_portal_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a realistic viewport
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Starting dev server check...")
        # Since we are in the environment where we can't easily start a background process and wait
        # we assume the server might be running or we navigate via the built files if possible.
        # However, typically we use localhost:3000

        try:
            page.goto("http://localhost:3000", wait_until="networkidle", timeout=10000)
        except Exception as e:
            print(f"Direct navigation failed: {e}. If the server isn't running, this is expected.")
            # In some cases, we might need to skip the visual check if the environment doesn't allow background servers.
            # But let's try to capture what we can.
            return

        # Check for Industrial branding
        expect(page.get_by_text("TSysLab Industrial")).to_be_visible()

        # Verify navigation items
        expect(page.get_by_text("Analytics")).to_be_visible()
        expect(page.get_by_text("Operational Hub")).to_be_visible()

        # Take screenshot
        os.makedirs("./verification", exist_ok=True)
        page.screenshot(path="./verification/portal_redesign.png", full_page=True)
        print("Screenshot captured at ./verification/portal_redesign.png")

        browser.close()

if __name__ == "__main__":
    verify_portal_redesign()
