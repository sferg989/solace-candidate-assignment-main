## Project Setup Thank you

- Thank you for clarity of the project, and leaving it open ended.
- Thank you for giving me a DB client that had a whole mess of error before I began.

## Project Setup

- Overall objective is to get the local dev setup so that all engineers have the same setup.
- Setup standard practices for the project.
  - Easy Docker Setup using .sh file **DONE**
  - lint **DONE**
  - unit testing **DONE** Packages installed, no tests written
  - pipeline. `ci.yaml` **DONE**
  - pipeline deployment **TO DO**
  - VS Code task runner. Easy check. Does everything pass before I push **DONE**

At this point I can confidently call this "A Project". It meets the baseline standards that every project should have.

- pipeline that passes/fails based on
  - linter,
  - unit testing
  - unit test coverage threshold.
  - Easy to use 1 step command line start the project and reset the project. ie. `./local.sh reset` && `./local.sh up`
  - The 1 missing piece is the CI/CD deployment to cloudflare, but due to time constraints I shall move on to the actual Dev work.
   
  