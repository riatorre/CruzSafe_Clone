import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Alert
} from "react-native";
import {
    Container,
    Header,
    Content,
    Footer,
    Left,
    Right,
    Body,
    Icon
} from "native-base";

import styles from "../components/styles.js";
import { textConstants } from "../components/styles.js";

const maxFeedbackTextLength = 1000;

class FeedbackScreen extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        feedbackText: ""
    };

    handleSubmit = async () => {
        await fetch("https://cruzsafe.appspot.com/api/reports/submitFeedback", {
            // Defines what type of call is being made; above link is a POST request, so POST is needed Below
            method: "POST",
            // Metadata in regards as to what is expected to be sent/recieved
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            },
            // Pass all data here; make sure all variables are named the same as in the API, and that the data types match
            body: JSON.stringify({ feedbackText: this.state.feedbackText })
        })
            // Successful Call to API
            .then(response => response.json()) // Parse response into JSON
            .then(responseJSON => {
                if (responseJSON.message == null) {
                    Alert.alert(
                        "Feedback Submitted",
                        "Thank you for your feedback! We will try our best to take it into account in the near future. We appreciate your help and support.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    this._isMounted &&
                                        this.setState({ feedbackText: "" });
                                    this.props.navigation.goBack();
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        "Error",
                        "An Error has Occurred; failed to submit your feedback. Please try again later."
                    );
                }
            })
            .catch(err => {
                Alert.alert(
                    "Error",
                    "An Error has Occurred; failed to submit your feedback. Please try again later."
                );
            });
    };

    static navigationOptions = {
        labelStyle: styles.drawerText,
        drawerLabel: "Feedback",
        drawerIcon: ({}) => (
            <Icon
                name={`${Platform.OS === "ios" ? "ios" : "md"}-star`}
                style={styles.drawerText}
            />
        )
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Container>
                    <Header style={styles.header}>
                        <Left>
                            {/* Icon used to open Side Drawer */}
                            <Icon
                                name={`${
                                    Platform.OS === "ios" ? "ios" : "md"
                                }-menu`}
                                style={styles.icon}
                                onPress={() =>
                                    this.props.navigation.openDrawer()
                                }
                            />
                        </Left>
                        <Body>
                            <Text style={styles.header_text}>Feedback</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.container}>
                        <View style={styles.feedbackContainer}>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    marginVertical: 20,
                                    fontSize: 24
                                }}
                            >
                                We would love to hear about what you have to say
                                about our mobile app! Please send us your
                                feedback so that we can keep improving your
                                experience!
                            </Text>
                            <Text style={styles.fieldHeaderBackground}>
                                Feedback
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                                <TextInput
                                    style={styles.textInputFeedback}
                                    autoCapitalize="sentences"
                                    placeholder="Your Feedback"
                                    multiline={true}
                                    numberOfLines={6}
                                    maxLength={maxFeedbackTextLength}
                                    onChangeText={feedbackText => {
                                        this._isMounted &&
                                            this.setState({
                                                feedbackText
                                            });
                                    }}
                                    value={this.state.feedbackText}
                                />
                            </View>
                            <Text style={styles.fieldFooterBackground}>
                                Characters Left:{" "}
                                {maxFeedbackTextLength -
                                    this.state.feedbackText.length}
                                /{maxFeedbackTextLength}
                            </Text>
                            <TouchableOpacity
                                style={styles.feedbackSubmit}
                                onPress={() => {
                                    if (this.state.feedbackText != "") {
                                        this.handleSubmit();
                                    } else {
                                        Alert.alert(
                                            "No Feedback",
                                            "Please enter your feedback before you try to submit.",
                                            [
                                                {
                                                    text: "OK",
                                                    onPress: () => {}
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    }
                                }}
                            >
                                <Icon
                                    name={`${
                                        Platform.OS === "ios" ? "ios" : "md"
                                    }-send`}
                                    style={styles.btnTextWhite}
                                />
                                <Text style={styles.btnTextWhite}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                    <Footer style={styles.footer}>
                        <Left
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                        <Body
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Text style={styles.footer_text}>
                                {textConstants.footerText}
                            </Text>
                        </Body>
                        <Right
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                    </Footer>
                </Container>
            </SafeAreaView>
        );
    }
}

export default FeedbackScreen;
