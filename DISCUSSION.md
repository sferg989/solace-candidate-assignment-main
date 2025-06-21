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

  ##Table implementation. 
   - formatting the phonenumber to make it look nice, but if you search a formatted phone number it does not work.  since it is not smart enough to hand the **() -**.
   - Specialties - it would have been nice to add coloring coding for each specialties.  Or 
   - Specialities - if you clicked on a specific value, it would filter all of the values by the selected, creating a multi selection view.
   - Locked Table Headers - in both mobile, and desktop view.  The user looses sight of the column header.  😢
   - Frozen columns.   - in both mobile, and desktop view.  The user looses sight of any specific column.  
   - Row Selection - Make the row clickable to see the details.  
   - Hide/Show columns on a per user basis.  Some users find the city data valuable, some will not.  
   - Give the user to save specific views, and be able to return that view.  
   

