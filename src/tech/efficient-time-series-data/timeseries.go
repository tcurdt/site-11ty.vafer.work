package main

import (
	"fmt"
	"sort"
)

func mapper(lines [][]string) [][]string {
	var result [][]string
	for _, line := range lines {
		date := line[0]
		track := line[1]
		result = append(result, []string{track, date})
		result = append(result, []string{"*", date})
	}
	return result
}

func compare(a, b []string) bool {
	al := len(a)
	bl := len(b)
	for i := 0; i < al && i < bl; i++ {
		av := a[i]
		bv := b[i]
		if av != bv {
			return av < bv
		}
	}
	return al < bl
}

func sorter(lines [][]string) [][]string {

	sort.Slice(lines, func(a, b int) bool {
		return compare(lines[a], lines[b])
	})

	return lines
}

func write(track string, key string, count int) {
	fmt.Println(track, key, count)
}

func reducer(lines [][]string) {

	counter_d := 1
	counter_m := 1
	counter_y := 1

	prev_d := ""
	prev_m := ""
	prev_y := ""
	prev_t := ""

	for i, line := range lines {

		date := line[1]
		d := date[0:10]
		m := date[0:7]
		y := date[0:4]
		t := line[0]

		if i != 0 {

			if d != prev_d {
				write(prev_t, prev_d, counter_d)
				counter_d = 1
			} else {
				counter_d += 1
			}

			if m != prev_m {
				write(prev_t, prev_m, counter_m)
				counter_m = 1
			} else {
				counter_m += 1
			}

			if y != prev_y {
				write(prev_t, prev_y, counter_y)
				counter_y = 1
			} else {
				counter_y += 1
			}

			if t != prev_t {
				counter_d = 1
				counter_m = 1
				counter_y = 1
			}
		}

		prev_d = d
		prev_m = m
		prev_y = y
		prev_t = t
	}

	if prev_t != "" {
		write(prev_t, prev_d, counter_d)
		write(prev_t, prev_m, counter_m)
		write(prev_t, prev_y, counter_y)
	}
}

func main() {

	lines := [][]string{
		{"2011-03-14", "track1"},
		{"2011-03-14", "track1"},
		{"2011-03-15", "track1"},
		{"2011-04-01", "track1"},
		{"2012-01-01", "track1"},
		{"2011-03-14", "track2"},
	}

	reducer(sorter(mapper(lines)))
}
