
const { Builder, By, until } = require('selenium-webdriver')
const { chromedriver } = require('chromedriver')

/**
 * @function waitUntilClickable
 * @description Wait until an element can be clickable. Is great for waiting for front-end pages to load. 
 *              Works for finding elements via css or xpath. Can be easily extended to more types
 *              WARNING: Is prone to running continuously forever
 * @param {*} driver 
 * @param {*} path 
 */
const waitUntilClickable = async(driver = {}, path = ``) => {
    var visible = false
    while(!visible){
        try{
            await driver.findElement(By.css(path))
            visible = true
        } catch (e) {
            try{
                await driver.findElement(By.xpath(path))
                visible = true
            } catch (e) {}
        }
    }
}

/**
 * @function main
 * @description Run the main program to save all Groupme Gallery photos that mimicks that of a front-end user
 */
const main = async () => {

    const timeBetweenWords = 100
    const raceType = `Practice`

    console.log("Running main...")
    console.log(`Running typer-racer-bot`)
    console.log(`typer-racer-bot: Typing each word with ${timeBetweenWords}ms apart`)

    // Build driver
    const driver = await new Builder().forBrowser(`chrome`)
                                      .build()

    // Open Browser
    await driver.get(`https://play.typeracer.com/`)

    // Click enter a practice race
    await waitUntilClickable(driver, `//a[contains(text(), "${raceType}")]`)
    const enterRaceButton = await driver.findElement(By.xpath(`//a[contains(text(), "${raceType}")]`))
    await enterRaceButton.click()

    // Get Racing text
    await waitUntilClickable(driver, `//table[@class="gameView"]/tbody/tr[2]/td/table/tbody//tr[1]//div`)
    const raceTextElement = await driver.findElement(By.xpath(`//table[@class="gameView"]/tbody/tr[2]/td/table/tbody//tr[1]//div`))
    const raceText = await raceTextElement.getText()
    console.log(`typer-racer-bot: Text: ${raceText}`)

    // Wait until the input is available to immediately start the race
    var raceInput = null
    while(true){
        try{
            raceInput = await driver.findElement(By.xpath(`//table[@class="inputPanel"]//input[@type="text"]`))
            await raceInput.sendKeys(``)
            break
        } catch (e) {}
    }

    // To prevent from being caught for cheating, parse the string by spaces and take a pause between each word
    const raceTextWords = await raceText.split(` `)
    for(const raceTextWord of raceTextWords){
        await raceInput.sendKeys(raceTextWord + ` `)
        await driver.sleep(timeBetweenWords)
    }

    console.log(`typer-racer-bot: Finished Race!`)

    // CLOSE driver
    //await driver.close()
    //await driver.quit()

    console.log(`typer-racer-bot: DONE`)

    return null
}

Promise.all([main()])