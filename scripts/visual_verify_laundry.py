from playwright.sync_api import sync_playwright, expect
import os

def verify_laundry_ui():
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

        # 2. Navigate to Laundry Orders
        print("Navigating to Laundry Orders...")
        page.wait_for_url("http://localhost:3000/", timeout=10000)
        page.get_by_role("tab", name="Orders").click()

        # 3. Verify Order UI elements
        expect(page.get_by_text("Order Management")).to_be_visible()
        expect(page.get_by_text("Operational Flow")).to_be_visible()

        # 4. Take screenshot
        os.makedirs("./verification", exist_ok=True)
        path = "./verification/laundry_order_ui.png"
        page.screenshot(path=path, full_page=True)
        print(f"Screenshot captured at {path}")

        browser.close()

if __name__ == "__main__":
    verify_laundry_ui()
