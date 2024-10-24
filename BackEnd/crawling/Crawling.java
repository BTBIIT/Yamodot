package com.example.crawling;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;


@Component
@EnableScheduling
public class Crawling {

    @Autowired
    private JdbcTemplate jdbcTemplate;


//    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void KBOCrawling() throws Exception {
        // ChromeDriver 위치 설정
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\KOSMO\\Downloads\\chromedriver-win64\\chromedriver.exe");

        // 결과 저장 리스트
        List<Object> results = new ArrayList<>();
 
        // WebDriver 초기화
        WebDriver driver = initWebDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 명시적 대기 설정

        try {
            driver.get("https://www.koreabaseball.com/Schedule/ScoreBoard.aspx");
            selectOptionsAndExtractData(driver, wait, results);
            
            // 콘솔로그 확인용
            LocalDateTime timeNow = LocalDateTime.now();
            DateTimeFormatter now = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            System.out.println(timeNow.format(now) + " 크롤링");


        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
        } finally {
            // 브라우저 종료
            driver.quit();
        }
    }

    private WebDriver initWebDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu"); // GPU 가속 사용안함
        options.addArguments("--headless"); // 헤드리스 모드에서 실행 (UI를 띄우지 않음)
        options.addArguments("--disable-extensions"); // 확장프로그램 사용안함

        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().pageLoadTimeout(Duration.ofMinutes(2)); // 페이지 로드 타임아웃 설정
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10)); // 암시적 대기 설정
        return driver;
    }

    // 경기 일정이나 점수 데이터를 추출하는 메서드
    private void selectOptionsAndExtractData(WebDriver driver, WebDriverWait wait, List<Object> results) {
       
       // 오늘날짜 설정
        LocalDate date = LocalDate.now();
        String today = date.toString().substring(8, 10);
        if(today.charAt(0) == '0') {
           today = today.substring(1);
        }
        today = "11";
        try {
            // 달력 이미지 요소가 클릭 가능할 때까지 기다림
            WebElement imageElement = wait.until(ExpectedConditions.elementToBeClickable(By.className("ui-datepicker-trigger")));
            imageElement.click(); // 달력 열기

            // 연도 선택
            Select selectYear = new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("ui-datepicker-year"))));
            selectYear.selectByValue("2024");  // 2024년 선택

            // 월 선택
            Select selectMonth = new Select(wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("ui-datepicker-month"))));
            selectMonth.selectByValue("9");  // 월 선택

            // 오늘날짜 클릭
            WebElement dateElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//td[@data-month='9' and @data-year='2024']/a[text()='"+ today +"']")));
            dateElement.click();

            // 페이지가 로드되거나 업데이트될 시간을 기다림
            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("ui-datepicker-calendar"))); // 달력이 사라질 때까지 기다림

            // 필요한 데이터를 추출
            extractGameData(driver, wait, results);

        } catch (NoSuchElementException | StaleElementReferenceException e) {
            System.out.println("Element not found or stale: " + e.getMessage());
        }
        

   
    }

    private void extractGameData(WebDriver driver, WebDriverWait wait, List<Object> results) {
        try {
            // 모든 smsScore 요소를 찾음
            List<WebElement> smsScoreDivs = driver.findElements(By.cssSelector("div.smsScore"));
            for (WebElement smsScoreDiv : smsScoreDivs) {

                // 날짜 추출
                WebElement gameData = driver.findElement(By.cssSelector("li.today"));
                WebElement todayElement = gameData.findElement(By.tagName("span"));
                String today = todayElement.getText();
                results.add(today); // date
                
                // 경기 장소와 시간 추출
                WebElement placeElement = smsScoreDiv.findElement(By.cssSelector("p.place"));
                String placeText = placeElement.getText();
                results.add(placeText); // ground_time
                
                // 점수 테이블 추출
                WebElement scoreTable = smsScoreDiv.findElement(By.cssSelector("table.tScore tbody"));
                List<WebElement> rows = scoreTable.findElements(By.tagName("tr"));

                String awayTeam = "";
                String homeTeam = "";
                List<String> awayScores = new ArrayList<>();
                List<String> homeScores = new ArrayList<>();

                int rowIndex = 0;
                for (WebElement row : rows) {
                    List<WebElement> teamElements = row.findElements(By.tagName("th"));
                    String teamName = "";
                    if (!teamElements.isEmpty()) {
                        teamName = teamElements.get(0).getText();
                    }

                    // 셀 데이터 추출 (td 태그)
                    List<WebElement> cellElements = row.findElements(By.tagName("td"));
                    List<String> cellTexts = new ArrayList<>();
                    for (WebElement cell : cellElements) {
                        cellTexts.add(cell.getText());
                    }

                    if (rowIndex == 0) {
                        awayTeam = teamName;
                        awayScores = cellTexts;
                    } else if (rowIndex == 1) {
                        homeTeam = teamName;
                        homeScores = cellTexts;
                    }
                    rowIndex++;
                }

                // 투수 추출
                WebElement pitchers = smsScoreDiv.findElement(By.cssSelector("p.win"));
                String pitcher = pitchers.getText();
                results.add(pitcher); // ground_time
                
                // 결과 리스트에 데이터 추가 (SQL 열 순서에 맞게)
                results.add(awayTeam);                // awayteam
                
                // 원정팀 점수 추가 (a1 ~ a15)
                for (int i = 0; i < 15; i++) {
                    if (i < awayScores.size()) {
                        results.add(awayScores.get(i));
                    } else {
                        results.add(null); // 데이터가 없을 경우 null로 채움
                    }
                }

                // 원정팀 추가 데이터 (ar, ah, ae, ab)
                for (int i = 15; i < 19; i++) {
                    if (i < awayScores.size()) {
                        results.add(awayScores.get(i));
                    } else {
                        results.add(null);
                    }
                }
                results.add(homeTeam);                // hometeam
                
                // 홈팀 점수 추가 (h1 ~ h15)
                for (int i = 0; i < 15; i++) {
                    if (i < homeScores.size()) {
                        results.add(homeScores.get(i));
                    } else {
                        results.add(null);
                    }
                }

                // 홈팀 추가 데이터 (hr, hh, hb, he)
                for (int i = 15; i < 19; i++) {
                    if (i < homeScores.size()) {
                        results.add(homeScores.get(i));
                    } else {
                        results.add(null);
                    }
                }

                System.out.println(results);
                
                // 결과 리스트 크기 확인
                System.out.println("Total parameters: " + results.size());

                // 파라미터 배열 생성
                Object[] params = results.toArray();
                
                
                // DB조회해서 이미 크롤링된 데이터면 true, 없으면 false
                String query = "SELECT DATE FROM crawling_scoreboard_sum";
                List<String> dateValues = jdbcTemplate.query(query, (rs, rowNum) -> rs.getString("date"));
                Boolean isExist = false;
                for(int i=0; i < dateValues.size(); i++) {
                   if(results.get(0).equals(dateValues.get(i))) {
                      isExist = true;
                   }
                }
                
                // 파싱 결과 results 값중에 공백이 있으면 데이터 인서트 하지 않음
                for(int i=0; i<results.size(); i++) {
                   if(results.get(i).equals(" ")) {
                      isExist = true;
                   }
                }
                // false 면 아래 내용을 실행함
                if(!isExist) {
                    // DB 넣는 부분
                   
                   // 임시 크롤링 데이터 테이블에 인서트
                    String insertCrawlingScoreboard = "INSERT INTO crawling_scoreboard (date, ground_time, pitcher, awayteam, "
                            + "a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, ar, ah, ae, ab, "
                            + "hometeam, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, hr, hh, hb, he) "
                            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    // 패배투수 업데이트
                    String updateLosePitcher = "UPDATE crawling_scoreboard\r\n"
                          + "SET lose_pitcher = SUBSTRING_INDEX(pitcher, '패: ', -1)";
                    // 승리투수 업데이트
                    String updateWinningPitcher = "UPDATE crawling_scoreboard\r\n"
                          + "SET winning_pitcher = substring_index(SUBSTRING_INDEX(substring_index(pitcher, '패: ', 1), '세: ', 1), '승: ', -1)";
                    // 홈투수 업데이트
                    String updateHomePitcher = "UPDATE crawling_scoreboard\r\n"
                          + "SET home_pitcher = if(ar > hr, lose_pitcher, winning_pitcher)";
                    // 원정투수 업데이트
                    String updateAwayPitcher = "UPDATE crawling_scoreboard\r\n"
                          + "SET away_pitcher = if(hr > ar, lose_pitcher, winning_pitcher)";
                    // 스케쥴 테이블에 전체 내용 인서트
                    String insertSchedule = "INSERT INTO schedule (game_date, day_of_the_week, season, away, home, away_score, home_score, ground, etc, winning_pitcher, losing_pitcher)\r\n"
                          + "SELECT \r\n"
                          + "   CONCAT(SUBSTRING_INDEX(REPLACE(DATE, '.', '-'), '(', 1), ' ', SUBSTRING_INDEX(ground_time, ' ', -1), ':00') AS game_date,\r\n"
                          + "   substring_index(SUBSTRING_INDEX(DATE, '(', -1), ')', 1) AS day_of_the_week,\r\n"
                          + "   '포스트' AS season,\r\n"
                          + "   awayteam AS away,\r\n"
                          + "   hometeam AS home,\r\n"
                          + "   ar AS away_score,\r\n"
                          + "   hr AS home_score,\r\n"
                          + "   substring_index(ground_time, ' ', 1) AS ground,\r\n"
                          + "   '-' AS etc,\r\n"
                          + "   winning_pitcher AS winning_pitcher,\r\n"
                          + "   lose_pitcher AS losing_pitcher\r\n"
                          + "FROM crawling_scoreboard;";
                    // 스코어보드 테이블에 전체 내용 인서트
                    String insertScoreboard = "INSERT INTO scoreboard (game_date, season, ground, away_team, away_inning1, away_inning2, away_inning3, away_inning4, away_inning5, away_inning6, away_inning7, away_inning8, away_inning9, away_inning10,\r\n"
                          + "                     away_inning11, away_inning12, away_inning13, away_inning14, away_inning15, away_runs, away_hits, away_errors, away_balls, away_pitcher, home_team, home_inning1, home_inning2,\r\n"
                          + "                     home_inning3, home_inning4, home_inning5, home_inning6, home_inning7, home_inning8, home_inning9, home_inning10, home_inning11, home_inning12, home_inning13, home_inning14,\r\n"
                          + "                     home_inning15, home_runs, home_hits, home_errors, home_balls, home_pitcher)\r\n"
                          + "SELECT \r\n"
                          + "   CONCAT(SUBSTRING_INDEX(REPLACE(DATE, '.', '-'), '(', 1), ' ', SUBSTRING_INDEX(ground_time, ' ', -1), ':00') AS game_date,\r\n"
                          + "   '포스트' AS season,\r\n"
                          + "   substring_index(ground_time, ' ', 1) AS ground,\r\n"
                          + "   awayteam AS away_team,\r\n"
                          + "   a1 AS away_inning1,\r\n"
                          + "   a2 AS away_inning2,\r\n"
                          + "   a3 AS away_inning3,\r\n"
                          + "   a4 AS away_inning4,\r\n"
                          + "   a5 AS away_inning5,\r\n"
                          + "   a6 AS away_inning6,\r\n"
                          + "   a7 AS away_inning7,\r\n"
                          + "   a8 AS away_inning8,\r\n"
                          + "   a9 AS away_inning9,\r\n"
                          + "   a10 AS away_inning10,\r\n"
                          + "   a11 AS away_inning11,\r\n"
                          + "   a12 AS away_inning12,\r\n"
                          + "   a13 AS away_inning13,\r\n"
                          + "   a14 AS away_inning14,\r\n"
                          + "   a15 AS away_inning15,\r\n"
                          + "   ar AS away_runs,\r\n"
                          + "   ah AS away_hits,\r\n"
                          + "   ae AS away_errors, \r\n"
                          + "   ab AS away_balls,\r\n"
                          + "   away_pitcher AS away_pitcher,\r\n"
                          + "   hometeam AS home_team,\r\n"
                          + "   h1 AS home_inning1,\r\n"
                          + "   h2 AS home_inning2,\r\n"
                          + "   h3 AS home_inning3,\r\n"
                          + "   h4 AS home_inning4,\r\n"
                          + "   h5 AS home_inning5,\r\n"
                          + "   h6 AS home_inning6,\r\n"
                          + "   h7 AS home_inning7,\r\n"
                          + "   h8 AS home_inning8,\r\n"
                          + "   h9 AS home_inning9,\r\n"
                          + "   h10 AS home_inning10,\r\n"
                          + "   h11 AS home_inning11,\r\n"
                          + "   h12 AS home_inning12,\r\n"
                          + "   h13 AS home_inning13,\r\n"
                          + "   h14 AS home_inning14,\r\n"
                          + "   h15 AS home_inning15,\r\n"
                          + "   hr AS home_runs,\r\n"
                          + "   hh AS home_hits,\r\n"
                          + "   he AS home_errors,\r\n"
                          + "   hb AS home_balls,\r\n"
                          + "   home_pitcher AS home_pitcher\r\n"
                          + "FROM crawling_scoreboard;";
                    // 크롤링 저장테이블에 크롤링한내용 인서트
                    String insertCrawlingScoreboardSum = "INSERT INTO crawling_scoreboard_sum\r\n"
                          + "SELECT * \r\n"
                          + "FROM crawling_scoreboard;";
                    // 임시 크롤링 테스트 비움
                    String deleteCrawlingScoreboard = "DELETE FROM crawling_scoreboard";
                    try {
                        jdbcTemplate.update(insertCrawlingScoreboard, params);
                        jdbcTemplate.update(updateLosePitcher);
                        jdbcTemplate.update(updateWinningPitcher);
                        jdbcTemplate.update(updateHomePitcher);
                        jdbcTemplate.update(updateAwayPitcher);
                        jdbcTemplate.update(insertSchedule);
                        jdbcTemplate.update(insertScoreboard);
                        jdbcTemplate.update(insertCrawlingScoreboardSum);
                        jdbcTemplate.update(deleteCrawlingScoreboard);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                // 결과 리스트 초기화
                results.clear();
            }
            
        } catch (NoSuchElementException e) {
            System.out.println("Element not found: " + e.getMessage());
        }
    }
}
