import "jest-extended";

import {
  countNameOccurrences, substituteAllNames, removeDoubleNegations, equalExceptNames
} from "./Main";

import { readTree } from "./Library/IO";

test("countNameOccurrences test", () => {
  expect(
    countNameOccurrences("x", { tag: "bool", value: false }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", { tag: "bool", value: true }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", { tag: "name", name: "x" }),
  ).toEqual(1)

  expect(
    countNameOccurrences("x", { tag: "name", name: "y" }),
  ).toEqual(0)

  expect(
    countNameOccurrences("xyz", { tag: "name", name: "xyz" }),
  ).toEqual(1)

  expect(
    countNameOccurrences("xyz", { tag: "name", name: "x" }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", {
      tag: "not",
      subtree: { tag: "bool", value: true }
    })
  ).toEqual(0);

  expect(
    countNameOccurrences("x", {
      tag: "not",
      subtree: { tag: "name", name: "x" }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("y", {
      tag: "not",
      subtree: { tag: "name", name: "x" }
    })
  ).toEqual(0);

  expect(
    countNameOccurrences("x", {
      tag: "or",
      leftSubtree: { tag: "name", name: "x" },
      rightSubtree: { tag: "bool", value: false }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("x", {
      tag: "or",
      leftSubtree: { tag: "name", name: "x" },
      rightSubtree: { tag: "name", name: "x" }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("x", {
      tag: "not",
      subtree: {
        tag: "or",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: { tag: "name", name: "x" }
      }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("x", {
      tag: "not",
      subtree: {
        tag: "or",
        leftSubtree: {
          tag: "not",
          subtree: { tag: "name", name: "x" }
        },
        rightSubtree: { tag: "name", name: "x" }
      }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("y", {
      tag: "not",
      subtree: {
        tag: "or",
        leftSubtree: {
          tag: "not",
          subtree: { tag: "name", name: "x" }
        },
        rightSubtree: { tag: "name", name: "y" }
      }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("y", {
      tag: "or",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "or",
          leftSubtree: {
            tag: "not",
            subtree: { tag: "name", name: "x" }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      },
      rightSubtree: {
        tag: "or",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: {
          tag: "not",
          subtree: { tag: "bool", value: true }
        }
      }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("x", {
      tag: "or",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "or",
          leftSubtree: {
            tag: "not",
            subtree: { tag: "name", name: "x" }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      },
      rightSubtree: {
        tag: "or",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: {
          tag: "not",
          subtree: { tag: "bool", value: false }
        }
      }
    })
  ).toEqual(2);
});

test("substituteAllNames test", () => {
  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      { tag: "bool", value: true }
    )
  ).toEqual({ tag: "bool", value: true });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      { tag: "bool", value: false }
    )
  ).toEqual({ tag: "bool", value: false });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      { tag: "name", name: "x" }
    )
  ).toEqual({ tag: "bool", value: false });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      { tag: "name", name: "y" }
    )
  ).toEqual({ tag: "bool", value: true });

  expect(
    substituteAllNames(
      new Map([["x", true], ["y", false]]),
      { tag: "name", name: "x" }
    )
  ).toEqual({ tag: "bool", value: true });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      {
        tag: "not",
        subtree: { tag: "name", name: "y" }
      }
    )
  ).toEqual({
    tag: "not",
    subtree: { tag: "bool", value: true }
  });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "not",
    subtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    }
  });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "not",
    subtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    }
  });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      {
        tag: "or",
        leftSubtree: {
          tag: "not",
          subtree: {
            tag: "not",
            subtree: { tag: "name", name: "x" }
          }
        },
        rightSubtree: { tag: "name", name: "y" }
      }
    )
  ).toEqual({
    tag: "or",
    leftSubtree: {
      tag: "not",
      subtree: {
        tag: "not",
        subtree: { tag: "bool", value: false }
      }
    },
    rightSubtree: { tag: "bool", value: true }
  });

  expect(
    substituteAllNames(
      new Map([["x", false], ["y", true]]),
      {
        tag: "not",
        subtree: {
          tag: "or",
          leftSubtree: {
            tag: "not",
            subtree: {
              tag: "not",
              subtree: { tag: "name", name: "x" }
            }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "not",
    subtree: {
      tag: "or",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "bool", value: false }
        }
      },
      rightSubtree: { tag: "bool", value: true }
    }
  });
});

test("removeDoubleNegations test", () => {
  expect(
    removeDoubleNegations({ tag: "bool", value: true })
  ).toEqual(
    { tag: "bool", value: true }
  );

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: { tag: "bool", value: true }
    })
  ).toEqual({
    tag: "not",
    subtree: { tag: "bool", value: true }
  });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: { tag: "bool", value: true }
      }
    })
  ).toEqual({ tag: "bool", value: true });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: { tag: "bool", value: true }
      }
    })
  ).toEqual({ tag: "bool", value: true });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: { tag: "bool", value: false }
      }
    })
  ).toEqual({ tag: "bool", value: false });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "bool", value: true }
        }
      }
    })
  ).toEqual({
    tag: "not",
    subtree: { tag: "bool", value: true }
  });

  expect(
    removeDoubleNegations({
      tag: "or",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "bool", value: true }
        }
      },
      rightSubtree: {
        tag: "not",
        subtree: { tag: "bool", value: true }
      }
    })
  ).toEqual({
    tag: "or",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    }
  });

  expect(
    removeDoubleNegations({
      tag: "or",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "bool", value: true }
        }
      },
      rightSubtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: { tag: "bool", value: true }
        }
      }
    })
  ).toEqual({
    tag: "or",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: { tag: "bool", value: true }
  });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "or",
        leftSubtree: {
          tag: "not",
          subtree: {
            tag: "not",
            subtree: { tag: "bool", value: true }
          }
        },
        rightSubtree: {
          tag: "not",
          subtree: {
            tag: "not",
            subtree: { tag: "bool", value: true }
          }
        }
      }
    })
  ).toEqual({
    tag: "not",
    subtree: {
      tag: "or",
      leftSubtree: { tag: "bool", value: true },
      rightSubtree: { tag: "bool", value: true }
    }
  });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: {
          tag: "or",
          leftSubtree: {
            tag: "not",
            subtree: {
              tag: "not",
              subtree: { tag: "bool", value: true }
            }
          },
          rightSubtree: {
            tag: "not",
            subtree: {
              tag: "not",
              subtree: { tag: "bool", value: true }
            }
          }
        }
      }
    })
  ).toEqual({
    tag: "or",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: { tag: "bool", value: true }
  });

  expect(
    removeDoubleNegations({
      tag: "not",
      subtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: {
            tag: "or",
            leftSubtree: {
              tag: "not",
              subtree: {
                tag: "not",
                subtree: { tag: "bool", value: true }
              }
            },
            rightSubtree: {
              tag: "not",
              subtree: {
                tag: "not",
                subtree: {
                  tag: "not",
                  subtree: { tag: "bool", value: true }
                }
              }
            }
          }
        }
      }
    })
  ).toEqual({
    tag: "not",
    subtree: {
      tag: "or",
      leftSubtree: { tag: "bool", value: true },
      rightSubtree: {
        tag: "not",
        subtree: { tag: "bool", value: true }
      }
    }
  });
});

test("equalExceptNames test", () => {
  expect(equalExceptNames(readTree("true || true"), readTree("true || true"))).toBe(true);
  expect(equalExceptNames(readTree("true || false"), readTree("true || true"))).toBe(false);
  expect(equalExceptNames(readTree("true"), readTree("true || true"))).toBe(false);
  expect(equalExceptNames(readTree("x"), readTree("true"))).toBe(false);
  expect(equalExceptNames(readTree("x"), readTree("x"))).toBe(true);
  expect(equalExceptNames(readTree("x"), readTree("y"))).toBe(true);
  expect(equalExceptNames(readTree("true || x"), readTree("true || y"))).toBe(true);
  expect(equalExceptNames(readTree("!(!a || x)"), readTree("!(!b || y)"))).toBe(true);
  expect(equalExceptNames(readTree("!(!a || x)"), readTree("!(b || !y)"))).toBe(false);
});