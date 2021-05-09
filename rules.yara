rule content {
    condition:
        true
}

rule successful {
    strings:
        $code2XX = /\"statusCode\":2\d\d/
    condition:
        $code2XX
}

rule error {
    strings:
        $errorCode = /\"statusCode\":(4|5)\d\d/
    condition:
        $errorCode
}

rule billing_required {
    meta:
        highestLevel = true
        price = 20
        action = "bill"
    condition:
        content and successful
}

rule billing_required {
    meta:
        highestLevel = true
        action = "logError"
    condition:
        content and error
}

rule should_not_be_detected {
    strings:
        $string1 = "bujasfbjkasbjkasdbjkasd"
    condition:
        $string1
}