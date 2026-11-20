import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


URL = "https://www.saucedemo.com/"
WAIT_TIME = 10

# Локаторы из заданий
USERNAME = (By.ID, "user-name")
PASSWORD = (By.NAME, "password")
LOGIN_BUTTON = (By.CSS_SELECTOR, ".submit-button")
PRODUCTS = (By.CSS_SELECTOR, ".inventory_item")
PRODUCT_PRICE = (By.CSS_SELECTOR, ".inventory_item_price")
ADD_BACKPACK = (By.ID, "add-to-cart-sauce-labs-backpack")
REMOVE_BACKPACK = (By.ID, "remove-sauce-labs-backpack")
CART_BADGE = (By.CSS_SELECTOR, ".shopping_cart_badge")
SORT = (By.CSS_SELECTOR, ".product_sort_container")
MENU = (By.ID, "react-burger-menu-btn")
LOGOUT = (By.ID, "logout_sidebar_link")
ERROR = (By.CSS_SELECTOR, '[data-test="error"]')


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


# Задание 1.2. Авторизация
@pytest.mark.smoke
@pytest.mark.regression
def test_authorization(driver):
    login(driver)

    assert "inventory.html" in driver.current_url
    assert driver.find_elements(*PRODUCTS)


# Задание 1.2. Добавление товара в корзину
@pytest.mark.smoke
@pytest.mark.regression
def test_add_product_to_cart(driver):
    wait = login(driver)

    wait.until(EC.element_to_be_clickable(ADD_BACKPACK)).click()
    wait.until(EC.text_to_be_present_in_element(CART_BADGE, "1"))

    assert driver.find_element(*CART_BADGE).text == "1"


# Задание 1.2. Удаление товара из корзины
@pytest.mark.regression
def test_remove_product_from_cart(driver):
    wait = login(driver)

    wait.until(EC.element_to_be_clickable(ADD_BACKPACK)).click()
    wait.until(EC.element_to_be_clickable(REMOVE_BACKPACK)).click()
    wait.until(EC.invisibility_of_element_located(CART_BADGE))

    assert not driver.find_elements(*CART_BADGE)


# Задание 1.2. Сортировка Price (high to low)
@pytest.mark.regression
def test_sorting(driver):
    wait = login(driver)

    select = Select(wait.until(EC.element_to_be_clickable(SORT)))
    select.select_by_value("hilo")

    wait.until(
        lambda browser: get_prices(browser)
        == sorted(get_prices(browser), reverse=True)
    )
    prices = get_prices(driver)

    assert prices == sorted(prices, reverse=True)


# Задание 1.2. Выход из системы
@pytest.mark.regression
def test_logout(driver):
    wait = login(driver)

    wait.until(EC.element_to_be_clickable(MENU)).click()
    wait.until(EC.element_to_be_clickable(LOGOUT)).click()
    wait.until(EC.url_to_be(URL))

    assert driver.find_element(*LOGIN_BUTTON).is_displayed()


# Задание 2.1. Параметризованный тест авторизации
@pytest.mark.regression
@pytest.mark.parametrize(
    "username, expected_result",
    [
        ("standard_user", "success"),
        ("locked_out_user", "locked"),
        ("problem_user", "success"),
        ("performance_glitch_user", "success"),
    ],
)
def test_authorization_with_different_users(
    driver,
    username,
    expected_result,
):
    driver.get(URL)
    enter_credentials(driver, username)

    wait_time = 20 if username == "performance_glitch_user" else WAIT_TIME
    wait = WebDriverWait(driver, wait_time)

    if expected_result == "locked":
        error = wait.until(EC.visibility_of_element_located(ERROR))
        assert "locked out" in error.text
    else:
        wait.until(EC.url_contains("inventory.html"))
        assert "inventory.html" in driver.current_url
