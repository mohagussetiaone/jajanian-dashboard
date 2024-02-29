export default function TruncateCharacter(fileName) {
  const maxCharacters = 35;
  if (fileName.length > maxCharacters) {
    return fileName.substring(0, maxCharacters - 3) + '...';
  } else {
    return fileName;
  }
}
