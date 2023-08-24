package com.ms1.notificationservice.utility;

import java.util.List;

public class Validator {

    public enum SupportedDataType { NO_CAST, INTEGER }

    public static ValidateResult isValid(List<String> inputs, List<SupportedDataType> types) {
        if (inputs.size() != types.size()) return new ValidateResult(false, "Array Length mismatch!");

        for (int i = 0; i < inputs.size(); i++) {
            ValidateResult res = isInputValid(inputs.get(i), types.get(i));
            if ( !res.isStatus() ) {
                return new ValidateResult(false, String.format("%s -> %s", inputs.get(i), res.getMessage()));
            }
        }

        return new ValidateResult(true, "");
    }

    private static ValidateResult isInputValid(String input, SupportedDataType type) {
        if (input == null) return new ValidateResult(false, "Null input");
        if (input.trim().equals("")) return new ValidateResult(false, "Empty Input");
        
        switch (type) {
            case NO_CAST:
                break;
            case INTEGER:
                try { Integer.valueOf(input); } catch (Exception ex) { return new ValidateResult(false, "Is not a number"); }
                break;
        }

        return new ValidateResult(true, "");
    }
}
