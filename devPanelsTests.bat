wt -M -d "./app" cmd /k npm start; ^
split-pane -V -d "./api" cmd /k npm run dev; ^
move-focus left; ^
split-pane -H -d "./app" cmd /k npm test; ^
move-focus right; ^
split-pane -H -d "./api" cmd /k npm run test-watch