import React from "react";
import { ListGroup } from "reactstrap";

import JokeComponent from "./joke-component";
import { Joke } from "../types";
import "./listJokes-component.scss";

export default function ListJokes(props: any) {
  return (
    <ListGroup className={`list${props.tab}`}>
      {props.jokes &&
        props.jokes.length > 0 &&
        props.jokes.map((joke: Joke) => {
          return (
            <JokeComponent
              key={joke.id}
              joke={joke}
              likeUnlike={props.likeUnlike}
              tab={props.tab}
            />
          );
        })}
    </ListGroup>
  );
}
