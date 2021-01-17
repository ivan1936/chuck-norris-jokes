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
} from "reactstrap";
import classnames from "classnames";
import "./App.scss";
import { Joke } from "./types";
import ListJokes from "./components/listJokes-component";

const App = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [rSelected, setRSelected] = useState(false);
  const [int, setInt] = useState(setInterval(() => {}, 3000000));
  const [jokes, setJokes] = useState(new Array<Joke>());
  const [likedJokes, setLikedJokes] = useState(new Array<Joke>());
  const [loading, setLoading] = useState(false);

  const setIds = new Set<number>();

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const stringLikedJokes = localStorage.getItem("likedJokes");

    if (stringLikedJokes !== null) {
      const tempArr = JSON.parse(stringLikedJokes);
      setLikedJokes(tempArr);
    }
  }, []);

  const memoFetch = useCallback(() => {
    const fetchJokes = () => {
      setLoading(true);
      fetch(`https://api.icndb.com/jokes/random`)
        .then((res) => res.json())
        .then((res) => {
          let size = setIds.size;
          setIds.add(res.value.id);

          if (size !== setIds.size) {
            const joke: Joke = {
              id: res.value.id,
              joke: res.value.joke,
              liked: false,
            };

            jokes.push(joke);
            setJokes([...jokes]);
          } else setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          return console.log(err);
        });
    };
    fetchJokes();
  }, [jokes, setIds]);

  const memoFetchInterval = useCallback(() => {
    const fetchJokesFromInterval = () => {
      const interval = setInterval(() => memoFetch(), 500);
      setInt(interval);
      setRSelected(true);
    };
    fetchJokesFromInterval();
  }, [memoFetch]);

  const clearIntervalFetch = () => {
    clearInterval(int);
    setRSelected(false);
  };

  const clearLikedJokes = () => {
    setLikedJokes([]);
    localStorage.setItem("likedJokes", JSON.stringify([]));

    jokes.forEach((j) => (j.liked = false));
    setJokes([...jokes]);
  };

  const likeUnlike = (joke: Joke) => {
    let updateJ = joke;
    updateJ.liked = !joke.liked;

    const index = jokes.indexOf(joke);
    if (index !== -1) {
      jokes[index] = updateJ;
      setJokes([...jokes]);
    }

    if (updateJ.liked) {
      if (!likedJokes.includes(updateJ)) {
        if (likedJokes.length === 10) likedJokes.splice(0, 1);
        likedJokes.push(updateJ);
        setLikedJokes([...likedJokes]);
        localStorage.setItem("likedJokes", JSON.stringify(likedJokes));
      }
    } else {
      if (likedJokes.includes(joke)) {
        const tempArr = likedJokes.filter((j) => j !== joke);
        setLikedJokes([...tempArr]);
        localStorage.setItem("likedJokes", JSON.stringify(tempArr));
      }
    }
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
              <Row style={{ marginTop: 10 }}>
                <Col>
                  <Button outline color="primary" onClick={() => memoFetch()}>
                    Добавить шутку
                  </Button>{" "}
                  <Button
                    outline
                    className={classnames(rSelected ? "liked" : "unliked")}
                    onClick={() =>
                      !rSelected ? memoFetchInterval() : clearIntervalFetch()
                    }
                  >
                    Добавить шутку через 3 сек
                  </Button>{" "}
                </Col>
                <Col className="bold">{loading && <div>Loading...</div>}</Col>
              </Row>

              <ListJokes
                jokes={jokes}
                likeUnlike={likeUnlike}
                tab={activeTab}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Button
                outline
                color="primary"
                onClick={() => clearLikedJokes()}
                style={{ marginTop: 10, marginLeft: 25 }}
              >
                Очистить
              </Button>{" "}
              <ListJokes
                jokes={likedJokes}
                likeUnlike={likeUnlike}
                tab={activeTab}
              />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default App;
