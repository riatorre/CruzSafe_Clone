import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    slideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    slide1: {
        backgroundColor: "rgba(20,20,200,0.3)"
    },
    slide2: {
        backgroundColor: "rgba(20,200,20,0.3)"
    },
    slide3: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
    slide4: {
        backgroundColor: "rgba(20,200,20,0.3)"
    },
    slide5: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
    slide6: {
        backgroundColor: "rgba(20,200,20,0.3)"
    },
    slide7: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
    slide8: {
        backgroundColor: "rgba(20,200,20,0.3)"
    }
});

export default class Screen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Swiper>
                    <View style={[styles.slideContainer, styles.slide1]}>
                        <Text>
                            [image of dilapidated building] Have you witnessed
                            non-emergency issues on campus which cause
                            inconvenience or a safety hazard? Perhaps a hallway
                            with inadequate lighting, a broken windows, or a
                            road partially blocked by trash?
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide2]}>
                        <Text>
                            [call 211 image] Some cities have a number to call
                            for such issues, often 211, but many do not,
                            particularly on college campuses. The CruzSafe app
                            was created as a way to address this oversight by
                            giving students a way to text reports of
                            non-emergency issues on campus.
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide3]}>
                        <Text>
                            Before you report an issue, it's important to stop
                            and think about the urgency of the situation. We
                            have created buttons corresponding to the level of
                            urgency of situations you may encounter. [stoplight
                            image on side]
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide4]}>
                        <Text>
                            If there is an imminent threat to life or property,
                            it is important to quickly call 911. Examples of
                            such situations include:
                        </Text>
                        <Text>- A fire, even if it is still small</Text>
                        <Text>
                            - A medical emergency, such as difficulty speaking
                            or breathing, chest pain, fainting, numbness,
                            poisoning, heavy bleeding, sudden intense pain,
                            severe burns, or suicidality
                        </Text>
                        <Text>
                            - A crime in progress or imminently possible crime,
                            such as an assault, burglary, or a suspicious person
                            lurking
                        </Text>
                        <Text>
                            - A car crash, particularly if it is at higher
                            speeds or someone feels dizzy or unwell [stoplight
                            on red]
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide5]}>
                        <Text>
                            If you press the red stoplight button, CruzSafe will
                            ask you to confirm that you wish to call 911 through
                            your phone app. [stoplight on red]
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide6]}>
                        <Text>
                            If you become aware of a completed crime or an
                            urgent problem on campus that not merit a call to
                            emergency services, it is still not appropriate to
                            report it through this app. Responses to reports
                            from this app can take 24 hours or more and the
                            reporting system is not designed to handle crimes.
                            Instead, please call the UC Santa Cruz non-emergency
                            dispatch at (831) 459-2231. [stoplight on yellow]
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide7]}>
                        <Text>
                            Examples of non-emergency situations where you
                            should call dispatch include:
                        </Text>
                        <Text>
                            -Property crimes such as theft or vandalism where no
                            evidence, witnesses, or suspects are known
                        </Text>
                        <Text>
                            -A minor car crash in which there is motor damage
                            but you are certain no one has been hurt and the
                            crash does not present a danger to other drivers
                        </Text>
                        <Text>-Illegal parking or abandoned vehicles</Text>
                        <Text>
                            -Non-emergency related questions for the police
                        </Text>
                    </View>
                    <View style={[styles.slideContainer, styles.slide8]}>
                        <Text>
                            If you press the yellow stoplight button, CruzSafe
                            will ask you to confirm that you wish to call the
                            police non-emergency number. [stoplight on yellow]
                        </Text>
                    </View>
                </Swiper>
            </View>
        );
    }
}
