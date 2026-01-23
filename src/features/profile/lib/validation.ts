export function normalizeNickname(nickname: string) {
  return nickname.trim();
}

export function nicknameRules(nickname: string): string | null {
  const nick = normalizeNickname(nickname);

  if (nick.length < 2 || nick.length > 8) {
    return "닉네임은 2~8자로 입력해주세요";
  }
  // TODO(optional): 특수문자, 공백 등 추가 검증

  return null;
}
