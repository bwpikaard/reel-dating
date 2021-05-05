import React, { useContext } from "react";
import "react-native-gesture-handler";
import {
    Text,
    ImageBackground,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../../assets/styles.js";
import UserContext from "../../../lib/UserContext";

const Account = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [firstName, setFirstName] = React.useState(user.name.first);
    const [lastName, setLastName] = React.useState(user.name.last);
    const [email, setEmail] = React.useState("");

    //Still need to add blocked accounts and profile picture change buttons - had issue with them before removing for overall well being.
    //Also change the button color for the update buttons.
    //Also, why would you have change password here? shouldn't it be it's own thing or redirect somewhere else?

    return (
        <View style={styles.userLoggedStack.settings.settings.container}>
            <ImageBackground
                source={require("../../../assets/images/background-settings.png")}
                style={styles.userLoggedStack.settings.settings.background}
                resizeMode="cover">
                <ScrollView>
                    <View style={styles.userLoggedStack.settings.settings.utilityBox}>
                        <Image
                            source={require("../../../assets/images/profile-picture-example.png")}
                            style={styles.userLoggedStack.settings.settings.profilePicture}
                        />
                        <View style={styles.userLoggedStack.settings.settings.itemContainer}>
                            <View style={styles.userLoggedStack.settings.settings.headerContent}>
                                <MaterialIcons name="account" size={40} color="white" />
                            </View>
                            <View style={styles.userLoggedStack.settings.settings.itemContent}>
                                <Text style={styles.userLoggedStack.settings.settings.accountText}>
                                    First Name:{" "}
                                </Text>
                                <TextInput
                                    color="white"
                                    onChangeText={text => setFirstName(text)}
                                    value={firstName}
                                    placeholder="First Name Sample"
                                    placeholderTextColor="white"
                                />
                            </View>

                            <View style={styles.userLoggedStack.settings.settings.itemContent}>
                                <Text style={styles.userLoggedStack.settings.settings.accountText}>
                                    Last Name:{" "}
                                </Text>
                                <TextInput
                                    color="white"
                                    onChangeText={text => setLastName(text)}
                                    value={lastName}
                                    placeholder="Last Name Sample"
                                    placeholderTextColor="white"
                                />
                            </View>

                            <View style={styles.userLoggedStack.settings.settings.itemContent}>
                                <Text style={styles.userLoggedStack.settings.settings.accountText}>
                                    Email:{" "}
                                </Text>
                                <TextInput
                                    color="white"
                                    onChangeText={text => setEmail(text)}
                                    value={email}
                                    placeholder="Email Sample"
                                    placeholderTextColor="white"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.userLoggedStack.settings.settings.buttonContainer}>
                        <TouchableOpacity>
                            <LinearGradient
                                colors={["#ff79cd", "#aa2ee6"]}
                                style={styles.userLoggedStack.settings.settings.linearGradient}
                                start={{ x: 0.7, y: 0 }}>
                                <Text style={styles.userLoggedStack.settings.settings.buttonText}>
                                    {" "}
                                    Change{" "}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

/*
<View style={page.box_content}>
    <Text style={page.text}>Username: </Text>
    <TextInput
        onChangeText={text => set_username(text)}
        value={username}
        placeholder="Username Sample"
        placeholderTextColor="white"
    />
</View>

<View style={page.box_content}>
    <Text style={page.text}>Password: </Text>
    <TextInput
        onChangeText={text => set_password(text)}
        value={password}
        placeholder="Password Sample?"
        placeholderTextColor="white"
    />
</View>
*/
export default Account;
