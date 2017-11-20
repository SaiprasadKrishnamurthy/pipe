package org.pipes.model;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

/**
 * Created by saipkri on 17/11/17.
 */
@Data
@Document(indexName = "bank", type = "account")
public class Account {
    private int account_number;
    private int balance;
    private String firstname;
    private String lastname;
    private int age;
    private String gender;
    private String address;
    private String employer;
    private String email;
    private String city;
    private String state;
}
