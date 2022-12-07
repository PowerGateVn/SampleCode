import * as React from "react";
import { Container, Content, Text, View, Button, Body, Title, Right, Header, Left, Icon } from "native-base";

export default class DetailComponent extends React.Component {
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon
                                active
                                name="menu"
                                onPress={() => this.props.navigation.navigate("DrawerOpen")}
                            />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Detail</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View>
                        <Button onPress={() => {
                            this.props.detailActions.incrementAction(1);
                        }}>
                            <Text>Cộng +</Text>
                        </Button>
                        <Button onPress={() => {
                            this.props.detailActions.decrementAction(1);
                        }}>
                            <Text>Trừ -</Text>
                        </Button>
                    </View>
                    <Text>
                        Count = {this.props.times}
                    </Text>
                </Content>
            </Container >
        );
    }
}