#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-tic-tac-toe-223843-223881/TicTacToeWebApp
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

