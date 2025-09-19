/**
 * 언어 정보 파싱 유틸리티 함수
 * 이중 JSON 인코딩, 배열, 문자열 등 다양한 형태의 언어 데이터를 통일된 문자열로 변환
 */

export const parseLanguage = (lang) => {
  if (!lang) return "";

  // 이중 JSON 인코딩 해제 (예: '["스페인어"]' → "스페인어")
  if (typeof lang === "string" && lang.startsWith("[") && lang.endsWith("]")) {
    try {
      const parsed = JSON.parse(lang);
      return Array.isArray(parsed) ? parsed[0] : lang;
    } catch {
      return lang;
    }
  }

  // 배열인 경우 첫 번째 요소 반환
  return Array.isArray(lang) ? lang[0] : lang;
};

/**
 * 사용자 데이터에서 언어 정보 추출
 */
export const extractLanguageData = (userData) => {
  const learningLanguage = parseLanguage(
    userData.learning_languages?.[0] ||
      userData.learning_language ||
      userData.learningLanguage
  );
  const teachingLanguage = parseLanguage(
    userData.teaching_languages?.[0] ||
      userData.teaching_language ||
      userData.teachingLanguage
  );

  return { learningLanguage, teachingLanguage };
};

/**
 * 관심사 데이터 정규화
 * 배열, 문자열, JSON 문자열 등 다양한 형태를 배열로 통일
 */
export const normalizeInterests = (interests) => {
  if (!interests) return [];

  // 이미 배열인 경우
  if (Array.isArray(interests)) {
    // 배열 안에 JSON 문자열이 있는 경우 처리
    const processedInterests = [];
    for (const interest of interests) {
      if (
        typeof interest === "string" &&
        interest.startsWith("[") &&
        interest.endsWith("]")
      ) {
        try {
          const parsed = JSON.parse(interest);
          if (Array.isArray(parsed)) {
            processedInterests.push(...parsed);
          } else {
            processedInterests.push(interest);
          }
        } catch {
          processedInterests.push(interest);
        }
      } else {
        processedInterests.push(interest);
      }
    }

    return processedInterests.filter((interest) => interest && interest.trim());
  }

  // 문자열인 경우
  if (typeof interests === "string") {
    // JSON 문자열인지 확인
    if (interests.startsWith("[") && interests.endsWith("]")) {
      try {
        const parsed = JSON.parse(interests);
        return Array.isArray(parsed)
          ? parsed.filter((interest) => interest && interest.trim())
          : [];
      } catch {
        // JSON 파싱 실패시 쉼표로 분리
        return interests
          .split(",")
          .map((interest) => interest.trim())
          .filter((interest) => interest);
      }
    }

    // 일반 문자열인 경우 쉼표로 분리
    return interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest);
  }

  return [];
};
