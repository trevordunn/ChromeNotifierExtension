var REFRESH_INTERVAL = 1000 * 30;

var refreshTimeout,
	lastDayTime,
	lastTime;

checkTime();

function checkTime (now) {
	now = now || new Date();

	clearTimeout(refreshTimeout);

	var nowTime = now.getTime(),
		nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
		nowDayTime = nowDay.getTime();

	// Reset for a new day:
	if (lastDayTime < nowDayTime) {
		lastTime = null;
	}

	if (lastTime && now.getDay() >= 1 && now.getDay() <= 5) {
		for (var i = 0, l = notifications.length - 1; i < l; i++) {
			var notification = notifications[i],
				notificationDate = new Date(nowDayTime + notification.time),
				notificationTime = notificationDate.getTime();

			// console.log(i, notificationDate, notificationTime, lastTime, nowTime, notificationTime > nowTime, notificationTime > lastTime, notificationTime <= nowTime);

			if (notificationTime > nowTime) {
				// This notification is ahead of now, so assume the rest are.
				break;
			} else if (notificationTime > lastTime && notificationTime <= nowTime) {
				sendNotification(notification);
			}
		}
	}

	lastTime = nowTime;
	lastDayTime = nowDayTime;

	refreshTimeout = setTimeout(checkTime, REFRESH_INTERVAL);
}

function sendNotification (notification) {
	var notificationData = {
		type: "basic",
		iconUrl: "icon.png",
		title: notification.title,
		message: notification.message || ""
	};

	if (notification.type === "202020") {
		notificationData.title = "20-20-20: " + notificationData.title;
		notificationData.type = "list";
		notificationData.items = [
			{ title: "Look", message: "20 feet away for 20 seconds" },
			{ title: "Blink", message: "your eyes" },
			{ title: "Stretch", message: "your shoulders and wrists" },
			{ title: "Check", message: "your posture" },
			{ title: "Drink", message: "some water" },
			{ title: "Walk", message: "around the office" }
		];

		setTimeout(function () {
			chrome.notifications.create("", {
				type: "basic",
				iconUrl: "icon.png",
				title: "20-20-20 Finished",
				message: ""
			});
		}, 1000 * 30);
	}

	chrome.notifications.create("", notificationData);
}
