// ============================================================
// ALL APPLICATION METHODS RELATED TO CURRENCY HANDLING
// ============================================================

class serviceCurrency {
  // ===================================
  // FORMAT CURRENCY SIGN
  // ===================================
  getSign(currency, default_type="#") {
    let currency_type = "",
      naira = "₦",
      dollar = "$",
      pound = "£",
      euro = "€",
      cedis = "₵";

    switch (currency) {
      case "naira":
      case "NGN":
      case "ng":
      case "ESCROW_NGN":
        currency_type = naira;
        break;
      case "dollar":
      case "USD":
      case "us":
      case "ESCROW_USD":
        currency_type = dollar;
        break;
      case "pound":
      case "GBP":
      case "gb":
      case "ESCROW_GBP":
        currency_type = pound;
        break;
      case "euro":
      case "EUR":
      case "EURO":
      case "ESCROW_EUR":
        currency_type = euro;
        break;
      case "cedis":
      case "GHS":
        currency_type = cedis;
        break;
      default:
        currency_type = default_type;
        console.log("Currency sign not available yet!");
    }

    return currency_type;
  }

  getCode(currency, dialing_code = "###") {
    let currency_type = "",
      naira = "NGN",
      dollar = "USD",
      pound = "GBP",
      cedis = "GHS";

    switch (currency) {
      case "naira":
      case "NGN":
      case "ng":
      case "ESCROW_NGN":
        currency_type = naira;
        break;
      case "dollar":
      case "USD":
      case "us":
      case "ESCROW_USD":
        currency_type = dollar;
        break;
      case "pound":
      case "GBP":
      case "gb":
      case "ESCROW_GBP":
        currency_type = pound;
        break;
      case "cedis":
      case "GHS":
        currency_type = cedis;
        break;
      default:
        currency_type = dialing_code;
    }

    return currency_type;
  }

  getName(currency, dialing_code = "-----") {
    let currency_type = "",
      naira = "Naira",
      dollar = "Dollar",
      pound = "Pounds",
      cedis = "Cedis",
      escrow_naira = "Escrow Naira",
      escrow_dollar = "Escrow Dollar",
      escrow_pounds = "Escrow Pounds";

    switch (currency) {
      case "naira":
      case "NGN":
      case "ng":
        currency_type = naira;
        break;
      case "dollar":
      case "USD":
      case "us":
        currency_type = dollar;
        break;
      case "pound":
      case "GBP":
      case "gb":
        currency_type = pound;
        break;
      case "cedis":
      case "GHS":
        currency_type = cedis;
        break;
      case "ESCROW_NGN":
      case "escrow_ngn":
        currency_type = escrow_naira;
        break;
      case "ESCROW_USD":
      case "escrow_usd":
        currency_type = escrow_dollar;
        break;
      case "ESCROW_GBP":
      case "escrow_gbp":
        currency_type = escrow_pounds;
        break;
      default:
        currency_type = dialing_code;
    }

    return currency_type;
  }

  // ===================================
  // FORMAT CURRENCY COMMA SEPARATOR
  // ===================================
  addComma(currency) {
    return new Intl.NumberFormat().format(currency);
  }
}

export const $serviceCurrency = new serviceCurrency();
