rule content {
    strings:
        $text_string1 = "con"
        $text_string2 = "AAAAAAAAAAAH"
    condition:
        $text_string1 and $text_string2
}

rule response {
    strings:
        $text_string1 = "success"
    condition:
        $text_string1
}