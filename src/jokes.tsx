import React from "react";
import { Card, Button, CardText, ListGroupItem, CardBody } from "reactstrap";

import { Joke } from "./types";

export default function Jokes(props: any) {
  return (
    <ListGroupItem key={props.joke.id}>
      <Card>
        <CardBody>
          <CardText>{props.joke.joke}</CardText>
          <Button
            className={"liked"}
            onClick={() => props.likeJoke(props.joke.id)}
          >
            Like
          </Button>
          <Button
            className={"unliked"}
            onClick={() => props.unlikeJoke(props.joke.id)}
          >
            Unlike
          </Button>
        </CardBody>
      </Card>
    </ListGroupItem>
  );
}
