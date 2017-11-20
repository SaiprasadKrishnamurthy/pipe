package com.sai.samples.bank.configuration;

import lombok.Data;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by saipkri on 20/11/17.
 */
@Configuration
@Data
@ComponentScan(basePackages = "com.sai.samples.bank")
public class BankAppConfiguration {



}
