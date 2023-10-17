export const copyText = (text: string) => {
  const fuckingSbTextArea = document.createElement("textarea");
  document.getElementById("root")?.append(fuckingSbTextArea);
  fuckingSbTextArea.innerText = text;
  fuckingSbTextArea.select();
  document.execCommand("copy");
  fuckingSbTextArea.remove();
};

import clipboardCopy from "clipboard-copy";

export const copyText2 = async (text: string) => {
  await clipboardCopy(text);
};
