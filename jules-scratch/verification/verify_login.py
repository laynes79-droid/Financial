import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")

    # Log in
    page.get_by_label("Usuário:").fill("test")
    page.get_by_label("Senha:").fill("test")
    page.get_by_role("button", name="Entrar").click()

    # Wait for navigation to the dashboard
    expect(page).to_have_url(re.compile(r".*/dashboard"))

    # Check for dashboard content
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
