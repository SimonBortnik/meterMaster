rule content {
    condition:
        true
}

rule response {
    strings:
        $text_string1 = "success"
    condition:
        $text_string1
}

rule successful {
    strings:
        $code2XX = /\"statusCode\":2\d\d/
    condition:
        $code2XX
}

rule billing_should_happen {
    meta:
        price = 20
    condition:
        content and successful
}

rule should_not_be_detected {
    strings:
        $string1 = "bujasfbjkasbjkasdbjkasd"
    condition:
        $string1
}