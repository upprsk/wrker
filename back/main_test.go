package main

import (
	"fmt"
	"net/http"
	"net/url"
	"testing"

	"github.com/pocketbase/pocketbase/tests"
	"github.com/pocketbase/pocketbase/tokens"
)

const testDataDir = "./test_pb_data"

func TestGetPolls(t *testing.T) {
	bobToken, err := generateRecordToken("users", "bob@example.com")
	if err != nil {
		t.Fatal(err)
	}

	daveToken, err := generateRecordToken("users", "dave@example.com")
	if err != nil {
		t.Fatal(err)
	}

	editorToken, err := generateRecordToken("users", "admin@example.com")
	if err != nil {
		t.Fatal(err)
	}

	adminToken, err := generateAdminToken("the.admin@example.com")
	if err != nil {
		t.Fatal(err)
	}

	// setup the test ApiScenario app instance
	setupTestApp := func(t *testing.T) *tests.TestApp {
		testApp, err := tests.NewTestApp(testDataDir)
		if err != nil {
			t.Fatal(err)
		}
		// no need to cleanup since scenario.Test() will do that for us
		// defer testApp.Cleanup()

		bindAppHooks(testApp)

		return testApp
	}

	scenarios := []tests.ApiScenario{
		{
			Name:            "try as guest (aka. no Authorization header)",
			Method:          http.MethodGet,
			Url:             "/api/collections/polls/records",
			ExpectedStatus:  200,
			ExpectedEvents:  map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{"\"page\":1", "\"totalItems\":0", "\"items\":[]"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:            "try as dave",
			Method:          http.MethodGet,
			Url:             "/api/collections/polls/records",
			ExpectedStatus:  200,
			RequestHeaders:  map[string]string{"Authorization": daveToken},
			ExpectedEvents:  map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{"\"page\":1", "\"totalItems\":0", "\"items\":[]"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:           "try as bob",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": bobToken},
			ExpectedEvents: map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{
				"\"page\":1",
				"\"totalItems\":1",
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as editor",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": editorToken},
			ExpectedEvents: map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{
				"\"page\":1",
				"\"totalItems\":1",
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as admin",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": adminToken},
			ExpectedEvents: map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{
				"\"page\":1",
				"\"totalItems\":1",
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
	}

	for _, scenario := range scenarios {
		scenario.Test(t)
	}
}

func TestGetPoll(t *testing.T) {
	bobToken, err := generateRecordToken("users", "bob@example.com")
	if err != nil {
		t.Fatal(err)
	}

	daveToken, err := generateRecordToken("users", "dave@example.com")
	if err != nil {
		t.Fatal(err)
	}

	editorToken, err := generateRecordToken("users", "admin@example.com")
	if err != nil {
		t.Fatal(err)
	}

	adminToken, err := generateAdminToken("the.admin@example.com")
	if err != nil {
		t.Fatal(err)
	}

	// setup the test ApiScenario app instance
	setupTestApp := func(t *testing.T) *tests.TestApp {
		testApp, err := tests.NewTestApp(testDataDir)
		if err != nil {
			t.Fatal(err)
		}
		// no need to cleanup since scenario.Test() will do that for us
		// defer testApp.Cleanup()

		bindAppHooks(testApp)

		return testApp
	}

	scenarios := []tests.ApiScenario{
		{
			Name:            "try as guest (aka. no Authorization header)",
			Method:          http.MethodGet,
			Url:             "/api/collections/polls/records/9keexq337xq9au2",
			ExpectedStatus:  404,
			ExpectedContent: []string{"\"data\":{}"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:            "try as dave",
			Method:          http.MethodGet,
			Url:             "/api/collections/polls/records/9keexq337xq9au2",
			ExpectedStatus:  404,
			RequestHeaders:  map[string]string{"Authorization": daveToken},
			ExpectedContent: []string{"\"data\":{}"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:           "try as bob",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": bobToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as editor",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": editorToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as admin",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": adminToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"audience\":[\"s1bkoq10uq5x7nu\",\"f4axxzmsfjx0eqg\",\"nozq23vjwel6egq\"]",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as bob with expand",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2?expand=audience",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": bobToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"expand\":{\"audience\":",
				"\"email\":\"bob@example.com\"",
				"\"fullName\":\"Bob the First\"",
				"\"fullName\":\"Tom\"",
				"\"fullName\":\"Bob the second\"",
			},
			NotExpectedContent: []string{
				"\"fullName\":\"Dave\"",
				"\"fullName\":\"Admin\"",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as editor with expand",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2?expand=audience",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": editorToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"fullName\":\"Bob the First\"",
				"\"fullName\":\"Tom\"",
				"\"fullName\":\"Bob the second\"",
			},
			NotExpectedContent: []string{
				"\"fullName\":\"Dave\"",
				"\"fullName\":\"Admin\"",
			},
			TestAppFactory: setupTestApp,
		},
		{
			Name:           "try as admin with expand",
			Method:         http.MethodGet,
			Url:            "/api/collections/polls/records/9keexq337xq9au2?expand=audience",
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": adminToken},
			ExpectedEvents: map[string]int{"OnRecordViewRequest": 1},
			ExpectedContent: []string{
				"\"anonymous\":false",
				"\"open\":true",
				"\"name\":\"Teste 1\"",
				"\"owner\":\"5dsro9o2k5kv8zw\"",
				"\"closingDate\":\"\"",
				"\"fullName\":\"Bob the First\"",
				"\"email\":\"bob@example.com\"",
				"\"fullName\":\"Tom\"",
				"\"email\":\"tom@example.com\"",
				"\"fullName\":\"Bob the second\"",
				"\"email\":\"bobber@example.com\"",
			},
			NotExpectedContent: []string{
				"\"fullName\":\"Dave\"",
				"\"email\":\"dave@example.com\"",
				"\"fullName\":\"Admin\"",
				"\"email\":\"admin@example.com\"",
			},
			TestAppFactory: setupTestApp,
		},
	}

	for _, scenario := range scenarios {
		scenario.Test(t)
	}
}

func TestGetPollQuestions(t *testing.T) {
	bobToken, err := generateRecordToken("users", "bob@example.com")
	if err != nil {
		t.Fatal(err)
	}

	daveToken, err := generateRecordToken("users", "dave@example.com")
	if err != nil {
		t.Fatal(err)
	}

	/*
		editorToken, err := generateRecordToken("users", "admin@example.com")
		if err != nil {
			t.Fatal(err)
		}

		adminToken, err := generateAdminToken("the.admin@example.com")
		if err != nil {
			t.Fatal(err)
		}
	*/

	// setup the test ApiScenario app instance
	setupTestApp := func(t *testing.T) *tests.TestApp {
		testApp, err := tests.NewTestApp(testDataDir)
		if err != nil {
			t.Fatal(err)
		}
		// no need to cleanup since scenario.Test() will do that for us
		// defer testApp.Cleanup()

		bindAppHooks(testApp)

		return testApp
	}

	createFilterParams := func(pollId string) string {
		values := url.Values{}
		values.Add("filter", fmt.Sprintf("poll.id='%s'", pollId))

		return values.Encode()
	}

	scenarios := []tests.ApiScenario{
		{
			Name:            "try as guest (aka. no Authorization header)",
			Method:          http.MethodGet,
			Url:             "/api/collections/pollQuestions/records?" + createFilterParams("9keexq337xq9au2"),
			ExpectedStatus:  200,
			ExpectedEvents:  map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{"\"page\":1", "\"totalItems\":0", "\"items\":[]"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:            "try as dave",
			Method:          http.MethodGet,
			Url:             "/api/collections/pollQuestions/records?" + createFilterParams("9keexq337xq9au2"),
			ExpectedStatus:  200,
			RequestHeaders:  map[string]string{"Authorization": daveToken},
			ExpectedEvents:  map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{"\"page\":1", "\"totalItems\":0", "\"items\":[]"},
			TestAppFactory:  setupTestApp,
		},
		{
			Name:           "try as bob",
			Method:         http.MethodGet,
			Url:            "/api/collections/pollQuestions/records?" + createFilterParams("9keexq337xq9au2"),
			ExpectedStatus: 200,
			RequestHeaders: map[string]string{"Authorization": bobToken},
			ExpectedEvents: map[string]int{"OnRecordsListRequest": 1},
			ExpectedContent: []string{
				"\"page\":1",
				"\"totalItems\":3",
				"\"insert\":\"Qual eh a cor do cavalo branco de Napoleao.\\n\"",
				"\"key\":\"Azul\"",
				"\"value\":\"azul\"",
				"\"key\":\"Verde\"",
				"\"value\":\"verde\"",
				"\"key\":\"Amarelo\"",
				"\"value\":\"amarelo\"",
				"\"key\":\"Marrom\"",
				"\"value\":\"marrom\"",
				"\"key\":\"Branco\"",
				"\"value\":\"branco\"",
				"\"key\":\"Preto\"",
				"\"value\":\"preto\"",
				"\"insert\":\"Qual eh o \"",
				"{\"insert\":\" da resposta anterior?\\n\"}",
				"\"insert\":\"Quanto eh \"",
				"\"insert\":\"2 + 2\"",
				"\"key\":\"1\"",
				"\"value\":\"1\"",
				"\"key\":\"2\"",
				"\"value\":\"2\"",
				"\"key\":\"nice\"",
				"\"value\":\"nice\"",
			},
			TestAppFactory: setupTestApp,
		},
	}

	for _, scenario := range scenarios {
		scenario.Test(t)
	}
}

func generateAdminToken(email string) (string, error) {
	app, err := tests.NewTestApp(testDataDir)
	if err != nil {
		return "", err
	}
	defer app.Cleanup()

	admin, err := app.Dao().FindAdminByEmail(email)
	if err != nil {
		return "", err
	}

	return tokens.NewAdminAuthToken(app, admin)
}

func generateRecordToken(collectionNameOrId string, email string) (string, error) {
	app, err := tests.NewTestApp(testDataDir)
	if err != nil {
		return "", err
	}
	defer app.Cleanup()

	record, err := app.Dao().FindAuthRecordByEmail(collectionNameOrId, email)
	if err != nil {
		return "", err
	}

	return tokens.NewRecordAuthToken(app, record)
}
