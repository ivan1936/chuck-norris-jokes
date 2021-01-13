import React, { useState, useCallback, useEffect } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  ListGroup,
} from "reactstrap";
import classnames from "classnames";
import "./App.scss";
import { Joke } from "./types";
import Jokes from "./jokes";

const App = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [rSelected, setRSelected] = useState(false);
  //const [rSelected2, setRSelected2] = useState(false);
  const [int, setInt] = useState(setInterval(() => {}, 3000000));
  const [jokes, setJokes] = useState(new Array<Joke>());
  const [likedJokes, setLikedJokes] = useState(new Array<Joke>());
  const [loading, setLoading] = useState(false);

  const jokes1: Joke[] = [];

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const stringLikedJokes = localStorage.getItem("likedJokes");
    if (stringLikedJokes !== null) setLikedJokes(JSON.parse(stringLikedJokes));
  }, []);

  const fetchAndSetJokes = () => {
    setLoading(true);
    fetch(`https://api.icndb.com/jokes/random`)
      .then((res) => res.json())
      .then((res) => {
        const joke: Joke = {
          id: res.value.id,
          joke: res.value.joke,
        };
        jokes1.push(joke);
        setJokes(jokes1);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        return console.log(err);
      });
  };

  const memoFetch = useCallback(() => {
    fetchAndSetJokes();
  }, []);

  let interval: NodeJS.Timeout;
  const fetchAndSetJokesFromInterval = () => {
    interval = setInterval(() => memoFetch(), 3000);
    setInt(interval);
    setRSelected(true);
  };

  const clearIntervalFetch = () => {
    clearInterval(int);
    setRSelected(false);
  };

  const likeJoke = (id: number) => {
    if (likedJokes.find((j) => j.id === id)) return;
    const likedJoke = jokes.find((j) => j.id === id);

    if (likedJoke !== undefined) {
      if (likedJokes.length === 10) likedJokes.shift();
      localStorage.setItem(
        "likedJokes",
        JSON.stringify([...likedJokes, likedJoke])
      );
      setLikedJokes([...likedJokes, likedJoke]);
    }
  };

  const unlikeJoke = (id: number) => {
    const newLikedJokes = likedJokes.filter((j) => j.id !== id);
    localStorage.setItem("likedJokes", JSON.stringify(newLikedJokes));
    setLikedJokes(newLikedJokes);
  };

  const clearLikedJokes = () => {
    setLikedJokes([]);
    localStorage.setItem("likedJokes", JSON.stringify([]));
  };

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Likes
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm={{ size: 10, offset: 1 }}>
              <Button outline color="primary" onClick={() => memoFetch()}>
                Добавить шутку
              </Button>{" "}
              <Button
                outline
                className={classnames(rSelected ? "liked" : "unliked")}
                onClick={() =>
                  !rSelected
                    ? fetchAndSetJokesFromInterval()
                    : clearIntervalFetch()
                }
              >
                Добавить шутку через 3 сек
              </Button>{" "}
              {loading && <div>Loading...</div>}
              <ListGroup>
                {jokes &&
                  jokes.length > 0 &&
                  jokes.map((joke) => {
                    return (
                      <Jokes
                        key={joke.id}
                        joke={joke}
                        likeJoke={likeJoke}
                        unlikeJoke={unlikeJoke}
                      />
                    );
                  })}
              </ListGroup>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Button outline color="primary" onClick={() => clearLikedJokes()}>
                Очистить
              </Button>{" "}
              <ListGroup>
                {likedJokes &&
                  likedJokes.length > 0 &&
                  likedJokes.map((joke) => {
                    return (
                      <Jokes
                        key={joke.id}
                        joke={joke}
                        likeJoke={likeJoke}
                        unlikeJoke={unlikeJoke}
                      />
                    );
                  })}
              </ListGroup>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default App;
