from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager


URL = "https://www.saucedemo.com/"
WAIT_TIME = 10
SCREENSHOTS = Path(__file__).parent.parent / "screenshots"

# Локаторы из заданий
USERNAME = (By.ID, "user-name")
PASSWORD = (By.NAME, "password")
LOGIN_BUTTON = (By.CSS_SELECTOR, ".submit-button")
PRODUCTS = (By.CSS_SELECTOR, ".inventory_item")
PRODUCT_NAME = (By.CSS_SELECTOR, ".inventory_item_name")
PRODUCT_PRICE = (By.CSS_SELECTOR, ".inventory_item_price")
CART = (By.CSS_SELECTOR, ".shopping_cart_link")
CART_BADGE = (By.CSS_SELECTOR, ".shopping_cart_badge")
CART_PRODUCT_NAME = (By.CSS_SELECTOR, ".cart_item .inventory_item_name")
SORT = (By.CSS_SELECTOR, ".product_sort_container")
PRODUCT_IMAGE = (By.CSS_SELECTOR, ".inventory_item_img img")
SOCIAL_X = (By.CSS_SELECTOR, '[data-test="social-x"]')
MENU = (By.ID, "react-burger-menu-btn")
LOGOUT = (By.ID, "logout_sidebar_link")
ERROR = (By.CSS_SELECTOR, '[data-test="error"]')

# XPath связывает название конкретного товара с кнопкой в той же карточке.
BACKPACK_BUTTON = (
    By.XPATH,
    "//div[@class='inventory_item']"
    "[.//div[text()='Sauce Labs Backpack']]//button",
)


@pytest.fixture
def driver():
    """Открывает отдельный браузер для теста и закрывает его после теста."""
    SCREENSHOTS.mkdir(exist_ok=True)
    browser = webdriver.Chrome(
        service=Service(ChromeDriverManager().install())
    )
    browser.maximize_window()

    try:
        yield browser
    finally:
        browser.quit()


def enter_credentials(driver, username):
    """Вводит логин, пароль и нажимает Login."""
    wait = WebDriverWait(driver, WAIT_TIME)
    username_input = wait.until(EC.visibility_of_element_located(USERNAME))
    password_input = wait.until(EC.visibility_of_element_located(PASSWORD))

    username_input.clear()
    password_input.clear()
    username_input.send_keys(username)
    password_input.send_keys("secret_sauce")
    wait.until(EC.element_to_be_clickable(LOGIN_BUTTON)).click()


def login(driver):
    """Входит на сайт как standard_user и возвращает объект ожидания."""
    driver.get(URL)
    enter_credentials(driver, "standard_user")

    wait = WebDriverWait(driver, WAIT_TIME)
    wait.until(EC.url_contains("inventory.html"))
    wait.until(EC.visibility_of_all_elements_located(PRODUCTS))
    return wait


def get_prices(driver):
    """Возвращает цены товаров как числа."""
    elements = driver.find_elements(*PRODUCT_PRICE)
    return [float(element.text.replace("$", "")) for element in elements]


# Задание 1.1. Авторизация
def test_authorization(driver):
    login(driver)

    assert "inventory.html" in driver.current_url
    assert driver.find_elements(*PRODUCTS)


# Задания 2.1 и 2.2. Товары и корзина
def test_products_and_cart(driver):
    wait = login(driver)

    products = wait.until(EC.visibility_of_all_elements_located(PRODUCTS))
    assert len(products) >= 3

    print("Первые три товара:")
    for product in products[:3]:
        name = product.find_element(*PRODUCT_NAME).text
        price = product.find_element(*PRODUCT_PRICE).text
        print(f"{name}: {price}")

    wait.until(EC.element_to_be_clickable(BACKPACK_BUTTON)).click()
    wait.until(EC.text_to_be_present_in_element(CART_BADGE, "1"))
    wait.until(EC.element_to_be_clickable(CART)).click()
    wait.until(EC.url_contains("cart.html"))

    product_in_cart = wait.until(
        EC.visibility_of_element_located(CART_PRODUCT_NAME)
    )
    assert product_in_cart.text == "Sauce Labs Backpack"

    driver.save_screenshot(str(SCREENSHOTS / "cart.png"))


# Задание 3.1. Сортировка Price (high to low)
def test_sorting(driver):
    wait = login(driver)

    select = Select(wait.until(EC.element_to_be_clickable(SORT)))
    select.select_by_value("hilo")

    wait.until(
        lambda browser: get_prices(browser)
        == sorted(get_prices(browser), reverse=True)
    )
    prices = get_prices(driver)

    assert prices[0] == max(prices)
    print(f"Цены по убыванию: {prices}")


# Дополнительное задание 3.2. Действия мышью
def test_mouse_actions(driver):
    wait = login(driver)

    image = wait.until(EC.visibility_of_element_located(PRODUCT_IMAGE))
    button = wait.until(EC.element_to_be_clickable(BACKPACK_BUTTON))

    ActionChains(driver).move_to_element(image).perform()
    ActionChains(driver).context_click(button).perform()
    ActionChains(driver).send_keys(Keys.ESCAPE).perform()

    assert button.text == "Add to cart"
    print("Выполнены наведение и правый клик")


# Задание 4.1. Работа с новой вкладкой
def test_new_tab(driver):
    wait = login(driver)

    original_tab = driver.current_window_handle
    old_tabs = driver.window_handles
    wait.until(EC.element_to_be_clickable(SOCIAL_X)).click()

    wait.until(EC.number_of_windows_to_be(2))
    new_tab = next(tab for tab in driver.window_handles if tab not in old_tabs)
    driver.switch_to.window(new_tab)

    wait.until(lambda browser: "x.com" in browser.current_url)
    assert "x.com" in driver.current_url
    print(f"URL новой вкладки: {driver.current_url}")

    driver.close()
    driver.switch_to.window(original_tab)
    assert "inventory.html" in driver.current_url


# Задание 5.1. Негативный сценарий и скриншот ошибки
def test_locked_user(driver):
    wait = login(driver)

    wait.until(EC.element_to_be_clickable(MENU)).click()
    wait.until(EC.element_to_be_clickable(LOGOUT)).click()
    wait.until(EC.url_to_be(URL))
    wait.until(EC.visibility_of_element_located(USERNAME))

    enter_credentials(driver, "locked_out_user")
    error = wait.until(EC.visibility_of_element_located(ERROR))

    assert "locked out" in error.text
    driver.save_screenshot(str(SCREENSHOTS / "locked_user_error.png"))

