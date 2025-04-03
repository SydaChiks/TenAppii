import { CommonActions } from "@react-navigation/native";

export const navigateToMainApp = (navigation) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Main" }],
    })
  );
};
