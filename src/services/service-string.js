// ============================================================
// ALL APPLICATION METHODS RELATED TO STRING HANDLING
// ============================================================

class serviceString {
  // ===================================
  // GENERATE RANDOM CHARACTERS
  // ===================================
  getRandomString(length) {
    let randomstring = "",
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  // =======================================
  // ENCODE STRING FROM BINARY TO ASCII
  // =======================================
  encodeString(string) {
    return btoa(
      `${this.getRandomString(5)}+${string}+${this.getRandomString(5)}`
    );
  }

  // ==============================================
  // DECODE ENCODED STRING FROM ASCII TO BINARY
  // ==============================================
  decodeString(encoded_string) {
    return atob(encoded_string).split("+")[1];
  }

  // ==============================================
  // GET CAPITALIZE TEXT
  // ==============================================
  getCapitalizeText(text) {
    let text_list = text.split(" ");
    let first_letters = [];
    let modified_list = [];

    text_list.map((text) => first_letters.push(text?.charAt(0)));
    text_list.map((text, index) =>
      modified_list.push(
        `${first_letters[index]?.toUpperCase()}${text?.substring(1)}`
      )
    );

    return modified_list.join(" ");
  }

  // ==========================================
  // GET STRING INITIALS
  // ==========================================
  getStringInitials(string) {
    let string_list = string.replace(/\s+/g, " ").split(" ");

    return string_list.length === 1
      ? string_list[0].slice(0, 1).toUpperCase()
      : `${string_list[0].slice(0, 1).toUpperCase()}${string_list[1]
          .slice(0, 1)
          .toUpperCase()}`;
  }

  // ==========================================
  // GET FIRST CHARACTER
  // ==========================================
  getFirstCharacter(string) {
    let string_list = string.replace(/\s+/g, " ").split(" ");
    return string_list[0].slice(0, 1).toUpperCase();
  }

  // ==========================================
  // GET SHORTENED LENGTH OF STRING
  // ==========================================
  getTruncatedText(string, length) {
    return string.length > length ? `${string.slice(0, length)}...` : string;
  }

  // ==========================================
  // CHECK IF A NUMBER IS AN ODD NUMBER
  // ==========================================
  isOddNumber(items) {
    if (items === 1) return true;
    else if (items === 0) return false;
    else return items % 2 ? true : false;
  }

  getAsterickedText(text, positions) {
    if (!text) return "";
    let formatted_text = "";
    formatted_text = positions
      .reduce((acc, val) => {
        acc[val] = "*";
        return acc;
      }, text.split(""))
      .join("");

    return formatted_text;
  }

  formattedBulkUnit(text){ 
    let value = Number(text)
    // .0[something] regex
    const zeroDecimals = /\.0+$|(\.[0-9]*[1-9])0+$/;
    if (isNaN(value)) return "0";

    //format number to K (thousand) or M (million)
    if (value >= 1e6)
      return (value / 1e6).toFixed(2).replace(zeroDecimals, "$1") + "M";
    else if (value >= 1e3)
      return (value / 1e3).toFixed(2).replace(zeroDecimals, "$1") + "K";
    else return value.toFixed(2).replace(zeroDecimals, "$1");
  }
}

export const $serviceString = new serviceString();
