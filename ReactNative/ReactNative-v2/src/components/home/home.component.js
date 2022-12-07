import * as React from "react";
import { Container, Content, Button, Text } from "native-base";

export default class HomeComponent extends React.Component {
    render() {
        return (
            <Container>
                <Content>
                    <Button onPress={() => {
                        this.props.navigation.navigate("Detail");
                    }}>
                        <Text>Go to detail</Text>
                    </Button>
                </Content>
            </Container >
        );
    }
}