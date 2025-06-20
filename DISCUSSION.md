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
   
## DB implementaion

- implement search on all fields using index **DONE**
- implement Order by **DONE**
- implement  search on a given field. **TO DO**
- implement pagination **TO DO**
- The Search is all thrown into 1 index. not that great for data like `Years experience`. Should have API element that returns records with:
  - multiple field search. AND/OR implementation. more specificity in the search. for example...
    ```
    I am looking for an MD and with a speciality in Life coaching
    ```
  - Postgres NOTICE when doing short searches, like partial phone numbers, or partial names.  **TO DO**
  - Geo location search - get the user lat long from Cloudflare  worker. this would require adding the lat long to the data. then doing the Haversine formula. I have done geolocation search both ways. manually with the Haversine formula, and using a third party search service like Algolia
  - multiple order by clauses.