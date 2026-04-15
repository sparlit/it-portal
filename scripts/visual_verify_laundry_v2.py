from playwright.sync_api import sync_playwright, expect
import os

def verify_laundry_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1024})
        page = context.new_page()

        # Determine port
        ports = [3000, 3001, 3002, 3003, 3004, 3005]
        success = False
        for port in ports:
            url = f"http://localhost:{port}/login"
            try:
                page.goto(url, wait_until="networkidle", timeout=3000)
                success = True
                print(f"Connected to {url}")
                break
            except:
                continue

        if not success:
            print("Failed to connect.")
            return

        # 1. Login
        print("Logging in...")
        page.fill('input[type="text"]', "admin")
        page.fill('input[type="password"]', "Admin@123")
        page.click('button:has-text("System Access")')

        # 2. Navigate to Laundry Orders
        print("Waiting for dashboard...")
        page.wait_for_selector('button:has-text("Orders")', timeout=10000)
        page.click('button:has-text("Orders")')

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
