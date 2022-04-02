import { StyleSheet } from "react-native";

export const COLOR_PRIMARY = "#0984e3";
export const COLOR_ACCENT = "#dfe6e9";
export const COLOR_LIGHT = "#dfe6e9";
export const COLOR_DARK = "#2d3436";
export const COLOR_BACKGROUND = "#ffffff";

export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BACKGROUND,
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 24,
  },
  h3: {
    fontSize: 20,
  },
  body: {
    fontSize: 14,
  },
  textInput: {
    marginTop: 10,
    backgroundColor: COLOR_BACKGROUND,
  },
  button: {
    paddingTop: 20,
  },
  header: {
    backgroundColor: COLOR_BACKGROUND,
    elevation: 0,
  },
  card: {
    elevation: 2,
    margin: 10,
    borderRadius: 10,
  }
});
