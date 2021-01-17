import React from "react";
import { Card, Button, CardText, ListGroupItem, CardBody } from "reactstrap";
import "./joke-component.scss";

export default function JokeComponent(props: any) {
  return (
    <ListGroupItem className={`item${props.tab}`} key={props.joke.id}>
      <Card>
        <CardBody className={`cardBody${props.tab}`}>
          <CardText>{props.joke.joke}</CardText>
          <Button
            className={props.joke.liked ? "liked" : "unliked"}
            onClick={() => props.likeUnlike(props.joke)}
          >
            {props.joke.liked ? "Unlike" : "Like"}
          </Button>
        </CardBody>
      </Card>
    </ListGroupItem>
  );
}
