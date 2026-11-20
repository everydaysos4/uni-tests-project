import os
import shutil
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


SCREENSHOTS = Path(__file__).parent.parent / "screenshots"


# Задание 1.1. Подготовка перед запуском всех тестов
@pytest.fixture(scope="session", autouse=True)
def prepare_screenshots_directory():
    """Создаёт каталог для скриншотов перед запуском набора тестов."""
    SCREENSHOTS.mkdir(exist_ok=True)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Сохраняет результат этапов выполнения теста в объекте теста."""
    outcome = yield
    report = outcome.get_result()
    setattr(item, f"rep_{report.when}", report)


# Задание 1.1. Запуск и закрытие браузера для каждого теста
@pytest.fixture
def driver(request):
    """Открывает Chrome перед тестом и закрывает его после теста."""
    options = Options()

    # В GitHub Actions браузер запускается без графического окна.
    if os.getenv("CI"):
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")

    browser_path = shutil.which("google-chrome") or shutil.which("chromium")
    if browser_path:
        options.binary_location = browser_path

    browser = webdriver.Chrome(options=options)

    if not os.getenv("CI"):
        browser.maximize_window()

    yield browser

    # Если тест упал, перед закрытием браузера сохраняется скриншот.
    if getattr(request.node, "rep_call", None) and request.node.rep_call.failed:
        file_name = f"{request.node.name}.png"
        browser.save_screenshot(str(SCREENSHOTS / file_name))

    browser.quit()
