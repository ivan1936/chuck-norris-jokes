import React from "react";
import { ListGroup } from "reactstrap";

import Jokes from "./jokes";
import { Joke } from "./types";

export default function ListJokes(props: any) {
  return (
    <ListGroup>
      {props.jokes &&
        props.jokes.length > 0 &&
        props.jokes.map((joke: Joke) => {
          return (
            <Jokes
              key={joke.id}
              joke={joke}
              likeJoke={props.likeJoke}
              unlikeJoke={props.unlikeJoke}
            />
          );
        })}
    </ListGroup>
  );
}
