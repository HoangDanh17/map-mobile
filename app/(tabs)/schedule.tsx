import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  height?: number;
  avatar?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Schedule = () => {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const getMonday = (date: Date) => {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diff);
    return monday;
  };

  const generateWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const generateEvents = (weekDays: Date[]) => {
    const avatars = [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
      "https://randomuser.me/api/portraits/men/3.jpg",
    ];
    const patientNames = ["Nguyen Van A", "Tran Thi B", "Le Van C"];

    const newEvents: { [key: string]: Event[] } = {};
    weekDays.forEach((day) => {
      const dateString = day.toISOString().split("T")[0];
      const numEvents = Math.floor(Math.random() * 3) + 1;
      newEvents[dateString] = Array.from({ length: numEvents }, (_, index) => ({
        id: `${dateString}-${index}`,
        name: patientNames[index % patientNames.length],
        date: dateString,
        time: `${8 + index}:00 - ${9 + index}:00`,
        avatar: avatars[index % avatars.length],
      }));
    });
    return newEvents;
  };

  useEffect(() => {
    const monday = getMonday(currentStartDate);
    const days = generateWeekDays(monday);
    setWeekDays(days);

    const generatedEvents = generateEvents(days);
    setEvents(generatedEvents);

    setSelectedDate(monday);
  }, [currentStartDate]);

  const handleNextWeek = () => {
    const monday = getMonday(currentStartDate);
    const nextWeekStart = new Date(monday);
    nextWeekStart.setDate(monday.getDate() + 7);

    setCurrentStartDate(nextWeekStart);
    setSelectedDate(nextWeekStart);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }
  };

  const handlePreviousWeek = () => {
    const monday = getMonday(currentStartDate);
    const previousWeekStart = new Date(monday);
    previousWeekStart.setDate(monday.getDate() - 7);

    setCurrentStartDate(previousWeekStart);
    setSelectedDate(previousWeekStart);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDate(day);
    const dateIndex = weekDays.findIndex(
      (d) => d.toDateString() === day.toDateString()
    );
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: dateIndex * SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
    }
  };

  const renderDayHeader = () => {
    return (
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => {
          const isSelected =
            selectedDate && day.toDateString() === selectedDate.toDateString();
          const dateString = day.toISOString().split("T")[0];
          const hasEvents = events[dateString] && events[dateString].length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayHeaderItem, isSelected && styles.selectedDay]}
              onPress={() => handleDaySelect(day)}
            >
              <Text style={styles.dayOfWeek}>
                {day.toLocaleDateString("default", { weekday: "short" })}
              </Text>
              <Text style={styles.dayOfMonth}>{day.getDate()}</Text>
              {hasEvents && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDayPage = (day: Date) => {
    const dateString = day.toISOString().split("T")[0];
    const dayEvents = events[dateString] || [];

    return (
      <View style={styles.dayPage} key={dateString}>
        {dayEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventItem}
            onPress={() => router.push(`/detail/${event.id}`)}
          >
            <View style={styles.eventContent}>
              <Image source={{ uri: event.avatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffset / SCREEN_WIDTH);

    if (weekDays[pageIndex]) {
      setSelectedDate(weekDays[pageIndex]);

      const monday = getMonday(weekDays[pageIndex]);
      if (
        monday.toDateString() !== getMonday(currentStartDate).toDateString()
      ) {
        setCurrentStartDate(monday);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
          <Text>Tuần trước</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Text>Tuần sau</Text>
        </TouchableOpacity>
      </View>

      {renderDayHeader()}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {weekDays.map((day) => renderDayPage(day))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
    marginTop: 4,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  navButton: {
    padding: 10,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dayHeaderItem: {
    alignItems: "center",
    padding: 10,
  },
  selectedDay: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  dayOfWeek: {
    fontSize: 12,
    color: "#666",
  },
  dayOfMonth: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dayPage: {
    width: SCREEN_WIDTH,
    padding: 10,
  },
  eventItem: {
    backgroundColor: "#f9c2ff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "space-between",
    height: 100,
  },
  eventName: {
    fontSize: 16,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
    alignSelf: "flex-end",
  },
});

export default Schedule;
