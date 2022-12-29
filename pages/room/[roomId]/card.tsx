import { Box, Center, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

type Bingo = {
  number: number;
  isClick: boolean;
};

const Card: NextPage = () => {
  const [rows, setRows] = useState<Bingo[][]>([]);

  const randomRange = (start: number, end: number) => {
    const list = [];
    for (let i = start; i <= end; i++) {
      list.push(i);
    }

    for (let i = list.length; 1 < i; i--) {
      let k = Math.floor(Math.random() * i);
      [list[k], list[i - 1]] = [list[i - 1], list[k]];
    }

    return list;
  };

  const sliceRandom = (start: number, end: number, slice: number) => {
    const numbers = randomRange(start, end);
    return numbers.slice(0, slice);
  };

  const first = sliceRandom(1, 15, 5);
  const second = sliceRandom(16, 30, 5);
  const third = sliceRandom(31, 45, 5);
  const forth = sliceRandom(46, 60, 5);
  const fifth = sliceRandom(61, 75, 5);

  useEffect(() => {
    let rs = [];

    for (let i = 0; i < 5; ++i) {
      let row = [
        { number: first[i], isClick: false },
        { number: second[i], isClick: false },
        { number: third[i], isClick: false },
        { number: forth[i], isClick: false },
        { number: fifth[i], isClick: false },
      ];
      rs[i] = row;
    }

    setRows(rs);
  }, []);

  return (
    <Box>
      <Center flexFlow='column'>
        <Box>
          <table>
            <tbody>
              {rows.map((row, columnIndex) => {
                return (
                  <tr key={columnIndex}>
                    {row.map((r: Bingo, rowIndex) => {
                      return (
                        <td
                          key={r.number}
                          style={{
                            backgroundColor: r.isClick ? 'white' : 'auto',
                          }}
                          data-rowindex={rowIndex}
                          data-columnindex={columnIndex}
                          onClick={(event) => {
                            const rowIndex = event.currentTarget.getAttribute(
                              'data-rowindex',
                            ) as unknown as number;
                            const columnIndex =
                              event.currentTarget.getAttribute(
                                'data-columnindex',
                              ) as unknown as number;

                            let rs = rows.slice();

                            rs[columnIndex][rowIndex].isClick =
                              !rs[columnIndex][rowIndex].isClick;

                            setRows(rs);
                          }}
                        >
                          {r.number}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Center>
    </Box>
  );
};

export default Card;
