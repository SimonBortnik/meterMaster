rule successful {
    strings:
        $code2XX = /statusCode: 2\d\d/
    condition:
        $code2XX
}

rule error {
    strings:
        $errorCode = /statusCode: (4|5)\d\d/
    condition:
        $errorCode
}

rule persisting_required {
    meta:
        highestLevel = true
        action = "logError"
    condition:
        error
}

rule login {
    meta:
        highestLevel = true
        price = 1
        action = "bill"
    strings:
        $loginUrl = "url: \"/api/auth/login\""
    condition:
        $loginUrl and successful
}

rule logout {
    meta:
        highestLevel = true
        price = 1
        action = "bill"
        extract = "['url', ':']"
    strings:
        $logoutUrl = "url: \"/api/auth/logout\""
    condition:
        $logoutUrl and successful
}

rule newVoting {
    meta:
        highestLevel = true
        price = 9
        action = "bill"
    strings:
        $newVoting = "\"title\":\"New Voting\""
        $create = "{\"create\":{"
    condition:
        $newVoting and $create
}

rule newQuestion {
    meta:
        highestLevel = true
        price = 2
        action = "bill"
    strings:
        $newQuestion = "\"Voting\":{\"createQuestion\":{"
    condition:
        $newQuestion
}

rule updateQuestion {
    meta:
        highestLevel = true
        price = 2
        action = "bill"
    strings:
        $newQuestion = "\"Question\":{\"update\":{"
    condition:
        $newQuestion
}

rule releaseQuestionnaire {
    meta:
        highestLevel = true
        price = 5
        action = "bill"
    strings:
        $questionnaireVisibilityTrue = /"Voting":{"update":{.*"visible":true/
    condition:
        $questionnaireVisibilityTrue
}

rule closeQuestionnaire {
    meta:
        highestLevel = true
        price = 5
        action = "bill"
    strings:
        $questionnaireVisibilityFalse = /"Voting":{"update":{.*"visible":false/
    condition:
        $questionnaireVisibilityFalse
}

rule unlockQuestion {
    meta:
        highestLevel = true
        price = 1
        action = "bill"
    strings:
        $questionVotableTrue = /"Question":{"update":{.*"votable":true/
    condition:
        $questionVotableTrue
}

rule voted {
    meta:
        highestLevel = true
        price = 1
        action = "bill"
    strings:
        $answerSubmitted = ":{\"Question\":{\"submitAnswers\":"
    condition:
        $answerSubmitted
}

// Can't distinguish from login
rule newAccountCreation {
    strings:
        $statusMessage = "statusMessage: \"Created\""
    condition:
        $statusMessage and login and false
}