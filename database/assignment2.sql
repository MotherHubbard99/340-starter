--insert Tony Stark's info into account
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--modify Tony Stark's account to "admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
--delete Tony Stark's record
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
--Modify GM Hummer
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
--use inner join to select make and model fields where the classification id is 2 for Sport
SELECT inv_make,
    inv_model,
    classification.classification_id
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = '2';
--update ALL image file paths to add vehicles in the file path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', 'images/vehicles/');